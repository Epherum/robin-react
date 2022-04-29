import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Page1 from "./pages/hi";
import Page2 from "./pages/page2";
function App() {
  return (
    <Router>
      <nav>
        <Link to="/home">Home</Link>
        <br />
        <Link to="/page1">page1</Link>
        <br />

        <Link to="/page2">page2</Link>
      </nav>
      <Routes>
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
