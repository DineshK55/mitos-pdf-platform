import { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [pdfs, setPdfs] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(true);
  const [activeSection, setActiveSection] = useState("view");

  const [deleteId, setDeleteId] = useState(null);

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

  // ✅ UPLOAD
  const handleUpload = async () => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSuccessMsg("File too large (Max 5MB)");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", title);
    formData.append("subject", subject);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      await res.json();

      setSuccessMsg("PDF uploaded successfully ✅");

      // RESET
      setFile(null);
      setTitle("");
      setSubject("Physics");

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      fetchPDFs();
    } catch (error) {
      console.error(error);
      setSuccessMsg("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE
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

  // ✅ FILTER LOGIC
  const filteredPDFs =
    filter === "All"
      ? pdfs
      : pdfs.filter((pdf) => pdf.subject === filter);

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">MITOS Learning</h2>

        <div
          className="menu-title"
          onClick={() => setOpenMenu(!openMenu)}
        >
          📁 PDF Materials
          <span>{openMenu ? "▲" : "▼"}</span>
        </div>

        {openMenu && (
          <div className="submenu">
            <div
              className={`submenu-item ${activeSection === "view" ? "active" : ""}`}
              onClick={() => setActiveSection("view")}
            >
              📄 View PDFs
            </div>

            <div
              className={`submenu-item ${activeSection === "add" ? "active" : ""}`}
              onClick={() => setActiveSection("add")}
            >
              ⬆️ Add PDF
            </div>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="topbar">
          <h3>PDF Manager</h3>
        </div>

        {/* ================= ADD SECTION ================= */}
        {activeSection === "add" && (
          <div className="upload-card">
            <h4>Upload PDF</h4>

            {successMsg && (
              <div className="success-msg">{successMsg}</div>
            )}

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <input
              type="text"
              placeholder="PDF Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="subject-dropdown"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>

            <button className="upload-btn" onClick={handleUpload}>
              {loading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
        )}

        {/* ================= VIEW SECTION ================= */}
        {activeSection === "view" && (
          <div className="pdf-list-container">

            <h2 className="page-title">📚 PDF List</h2>

            {/* ✅ FILTER BUTTONS */}
            <div className="filter-buttons">
              {["All", "Physics", "Chemistry", "Biology"].map(cat => (
                <button
                  key={cat}
                  className={filter === cat ? "active" : ""}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <table className="pdf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>PDF Name</th>
                  <th>Subject</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPDFs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No PDFs available 📭
                    </td>
                  </tr>
                ) : (
                  [...filteredPDFs]
                    .sort((a, b) => b.id - a.id)
                    .map((pdf, index) => (
                      <tr key={pdf.id}>
                        <td>{index + 1}</td>

                        <td className="pdf-name">
                          {pdf.title}
                        </td>

                        <td>{pdf.subject}</td>

                        <td className="actions">
                          <a
                            href={pdf.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="view-btn"
                          >
                            View
                          </a>

                          <button
                            className="delete-btn"
                            onClick={() => setDeleteId(pdf.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>

          </div>
        )}

        {/* ================= DELETE MODAL ================= */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Delete PDF</h3>
              <p>Are you sure you want to delete this PDF?</p>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>

                <button
                  className="confirm-btn"
                  onClick={() => {
                    handleDelete(deleteId);
                    setDeleteId(null);
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;