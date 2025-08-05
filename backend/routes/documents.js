// backend/routes/document.js
const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../lib/supabase");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
console.log("Supabase client:", supabase);

// 📄 GET all documents
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ⬆️ POST upload document
router.post("/", upload.single("file"), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file || !title) {
    return res.status(400).json({ error: "Missing title or file" });
  }

  const filename = `${uuidv4()}-${file.originalname}`;
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (storageError) return res.status(500).json({ error: storageError.message });

  const { data: publicUrlData } = supabase.storage.from("documents").getPublicUrl(filename);

  const { error: insertError } = await supabase.from("documents").insert([
    {
      title,
      description,
      filename,
      url: publicUrlData.publicUrl,
    },
  ]);

  if (insertError) return res.status(500).json({ error: insertError.message });

  res.json({ success: true });
});

// ❌ DELETE document by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    return res.status(404).json({ error: "Document not found" });
  }

  await supabase.storage.from("documents").remove([doc.filename]);

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (deleteError) return res.status(500).json({ error: deleteError.message });

  res.json({ success: true });
});

module.exports = router;
