const { admin, bucket } = require("../firebase/firebaseConfig");

// UPLOAD
exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    const { title, subject } = req.body; // ✅ UPDATED

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const fileName = Date.now() + "_" + file.originalname;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: error.message });
    });

    stream.on("finish", async () => {
      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2030",
      });

      // ✅ SAVE TO FIRESTORE WITH SUBJECT
      const docRef = await admin.firestore().collection("pdfs").add({
        title,
        subject, // 🔥 IMPORTANT
        fileUrl: url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({
        message: "PDF uploaded successfully",
        data: {
          id: docRef.id,
          title,
          subject, // 🔥 IMPORTANT
          fileUrl: url,
        },
      });
    });

    stream.end(file.buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL
exports.getAllPDFs = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("pdfs").get();

    const pdfs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), // ✅ will now include subject
    }));

    res.status(200).json(pdfs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE
exports.deletePDF = async (req, res) => {
  try {
    const { id } = req.params;

    await admin.firestore().collection("pdfs").doc(id).delete();

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};