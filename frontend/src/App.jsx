import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdvancedLoginPage from "./auth/Login";
import TaskScreen from "./tasks/TaskScreen";
import Dashboard from "./manager_screens/Dashboard";
import JitsiAudioCall from "./Jitsi";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AdvancedLoginPage/>} />
        <Route path="/home" element={<TaskScreen/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/meetings" element={<JitsiAudioCall/>} />

      </Routes>
    </Router>
  );
};

export default App;
