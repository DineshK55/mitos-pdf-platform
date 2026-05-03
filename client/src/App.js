import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PDFList from "./pages/PDFList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* ✅ ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ✅ USER PDF PAGE */}
        <Route path="/pdfs" element={<PDFList />} />

      </Routes>
    </Router>
  );
}

export default App;