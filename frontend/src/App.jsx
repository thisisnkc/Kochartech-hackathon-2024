import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdvancedLoginPage from "./auth/Login";
import TaskScreen from "./tasks/TaskScreen";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AdvancedLoginPage/>} />
        <Route path="/home" element={<TaskScreen/>} />
      </Routes>
    </Router>
  );
};

export default App;
