import { useEffect, useState } from "react";
import "./PDFList.css";

function PDFList() {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/pdf/all")
      .then(res => res.json())
      .then(data => setPdfs(data));
  }, []);

  return (
    <div className="pdf-page">

      <h1>📚 PDF Library</h1>

      {pdfs.length === 0 ? (
        <p className="empty">No PDFs available</p>
      ) : (
        pdfs.map(pdf => (
          <div key={pdf.id} className="pdf-row">

            <div>
              📄 {pdf.title}
              <p>{pdf.description}</p>
            </div>

            <div className="actions">
              <a href={pdf.fileUrl} target="_blank" rel="noreferrer">
                <button className="view">View</button>
              </a>

              <a href={pdf.fileUrl} download>
                <button className="download">Download</button>
              </a>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default PDFList;