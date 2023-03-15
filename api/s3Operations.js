require('dotenv').config()
const path = require('path')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const basicAuthMiddleware = require('./basicAuthMiddleware').basicAuthMiddleware

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // no larger than 15MB
  },
})

const s3Upload = async (files, fileInfo) => {
  const s3client = new S3Client()
  const timestampInMilliseconds = new Date().getTime()
  const params = files.map((file) => {
    const fileExtension = path.extname(file.originalname)
    fileInfo.fileExtension = fileExtension
    fileInfo.timestampInMilliseconds = timestampInMilliseconds
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${timestampInMilliseconds}${fileExtension}`,
      Body: file.buffer,
    }
  })
  return await Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  )
}

router.post(
  '/upload',
  upload.array('file'),
  basicAuthMiddleware,
  async (req, res) => {
    try {
      const fileInfo = {
        originalName: '',
        fileExtension: '',
      }
      await s3Upload(req.files, fileInfo)
      return res.json({
        link: `${process.env.AWS_BUCKET_LINK_PREFIX}${fileInfo.timestampInMilliseconds}${fileInfo.fileExtension}`,
      })
    } catch (err) {
      res.status(500).json({
        error: err.message,
      })
    }
  }
)

module.exports = router
