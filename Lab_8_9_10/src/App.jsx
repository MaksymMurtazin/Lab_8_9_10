import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import "./index.css";

function App() {
    return (
        <Router>
            <div className="container">
                <h1>Кінотеатр Movie House</h1>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/booking/:id" element={<Booking />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
