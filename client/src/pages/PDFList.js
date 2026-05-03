import { useEffect, useState } from "react";

function PDFList() {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/pdf/all")
      .then(res => res.json())
      .then(data => setPdfs(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 PDF Library</h1>

      {pdfs.map(pdf => (
        <div
          key={pdf.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "8px"
          }}
        >
          <h3>{pdf.title}</h3>
          <p>{pdf.description}</p>

          <a href={pdf.fileUrl} target="_blank" rel="noreferrer">
            <button>👁 View</button>
          </a>

          <a href={pdf.fileUrl} download>
            <button style={{ marginLeft: "10px" }}>⬇ Download</button>
          </a>
        </div>
      ))}
    </div>
  );
}

export default PDFList;