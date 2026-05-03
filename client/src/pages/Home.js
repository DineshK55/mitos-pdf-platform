import { useState, useEffect } from "react";

function Home() {
  const [pdfs, setPdfs] = useState([]);

  // ✅ DOWNLOAD FUNCTION
 const handleDownload = (url, filename) => {
  const downloadUrl = url + "&response-content-disposition=attachment";

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  link.click();
};

  // ✅ FETCH PDFs AUTOMATICALLY
  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pdf/all");
        const data = await res.json();
        setPdfs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPDFs();
  }, []);

  return (
    <div>

      {/* 🔥 HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, #6a11cb, #b44cff)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
          borderRadius: "20px",
          margin: "20px",
        }}
      >
        <h1>MITOS Learning</h1>
        <p>Master NEET with Smart Study Materials</p>
      </div>

      {/* 🔥 PDF LIST */}
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "#6a11cb" }}>📚 Study Materials</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              style={{
                borderRadius: "15px",
                padding: "20px",
                background: "white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{pdf.title}</h3>
              <p>{pdf.description}</p>

              <div style={{ marginTop: "10px" }}>
                {/* 👁 VIEW BUTTON */}
                <a href={pdf.fileUrl} target="_blank" rel="noreferrer">
                  <button
                    style={{
                      padding: "8px 12px",
                      background: "#6a11cb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    👁 View
                  </button>
                </a>

                {/* ⬇ DOWNLOAD BUTTON */}
                <button
                    onClick={() =>
    handleDownload(
      pdf.fileUrl,
      pdf.title.replace(/\s+/g, "_") + ".pdf"
    )
                  }
                  style={{
                    marginLeft: "10px",
                    padding: "8px 12px",
                    background: "#ff4ecd",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;