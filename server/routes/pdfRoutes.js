const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const { uploadPDF, getAllPDFs, deletePDF } = require("../controllers/pdfController");

router.post("/upload", upload.single("pdf"), uploadPDF);

router.get("/all", getAllPDFs);

router.delete("/:id", deletePDF);

module.exports = router;