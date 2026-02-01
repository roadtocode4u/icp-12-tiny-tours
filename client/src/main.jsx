import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";
import EditTour from "./views/EditTour.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import NewTour from "./views/NewTour.jsx";
import Signup from "./views/Signup.jsx";
import Tours from "./views/Tours.jsx";
import Dashboard from "./views/Dashboard.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/new" element={<NewTour />} />
      <Route path="/tours/edit" element={<EditTour />} />
    </Routes>
  </BrowserRouter>
);
