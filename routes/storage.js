const express = require("express")
const router = express.Router()
const {uploadMiddlewareMemory} = require("../utils/handleStorage")

const { updateImage } = require("../controllers/storage.js")

router.patch("/logo", uploadMiddlewareMemory.single("image"), updateImage)

module.exports = router