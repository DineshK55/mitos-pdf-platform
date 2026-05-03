import { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [pdfs, setPdfs] = useState([]);
  const [filter, setFilter] = useState("All");

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url + "&response-content-disposition=attachment";
    link.download = filename;
    link.click();
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/pdf/all")
      .then(res => res.json())
      .then(data => setPdfs(data));
  }, []);

  // ✅ CORRECT FILTER LOGIC
  const filteredPDFs =
    filter === "All"
      ? pdfs
      : pdfs.filter(pdf => pdf.subject === filter);

  return (
    <div className="home">

      {/* HERO */}
      <div className="hero">
        <h1>MITOS Learning</h1>
        <p>Master NEET with Smart Study Materials</p>
      </div>

      {/* INFO */}
      <div className="info">
        <h2>🚀 What You’ll Get</h2>
        <p>✔ Chapter-wise PDFs | ✔ Quick Revision | ✔ Exam-focused notes</p>
      </div>

      {/* FILTER */}
      <div className="filters">
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

      {/* LIST */}
      <div className="list">
        {filteredPDFs.length === 0 ? (
          <p className="no-data">No PDFs found</p>
        ) : (
          filteredPDFs.map(pdf => (
            <div key={pdf.id} className="list-row">

              <div className="pdf-info">
                📄 {pdf.title}
                
              </div>

              <div className="actions">
                <a href={pdf.fileUrl} target="_blank" rel="noreferrer">
                  <button className="view">View</button>
                </a>

                <button
                  className="download"
                  onClick={() =>
                    handleDownload(
                      pdf.fileUrl,
                      pdf.title.replace(/\s+/g, "_") + ".pdf"
                    )
                  }
                >
                  Download
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Home;