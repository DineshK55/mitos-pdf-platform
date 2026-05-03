import { useState, useEffect } from "react";

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfs, setPdfs] = useState([]);

  // 🔥 Fetch PDFs
  const fetchPDFs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pdf/all");
      const data = await res.json();
      setPdfs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  // 🔥 Upload PDF
  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await fetch("http://localhost:5000/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      await res.json();
      alert("Uploaded successfully");

      // ✅ reset form
      setFile(null);
      setTitle("");
      setDescription("");

      fetchPDFs();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  // 🔥 Delete PDF
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/pdf/${id}`, {
        method: "DELETE",
      });

      fetchPDFs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>🔐 Admin Dashboard</h2>

      {/* 🔥 UPLOAD FORM */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br /><br />

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <button onClick={handleUpload}>Upload PDF</button>
      </div>

      {/* 🔥 PDF LIST */}
      <h3>All PDFs</h3>

      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h4>{pdf.title}</h4>
          <p>{pdf.description}</p>

          <a href={pdf.fileUrl} target="_blank" rel="noreferrer">
            View
          </a>

          <button
            onClick={() => handleDelete(pdf.id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}

export default AdminDashboard;