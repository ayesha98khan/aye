import { Routes, Route, Navigate } from "react-router-dom";
import { token } from "./lib/api";

import Auth from "./pages/Auth";
import Forgot from "./pages/Forgot";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import RecruiterHub from "./pages/RecruiterHub";
import Company from "./pages/Company";
import Board from "./pages/Board";
import NotFound from "./pages/NotFound";

export default function App() {
  const authed = !!token();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={authed ? "/feed" : "/auth"} />} />

      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot" element={<Forgot />} />

      <Route path="/feed" element={authed ? <Feed /> : <Navigate to="/auth" />} />
      <Route path="/profile" element={authed ? <Profile /> : <Navigate to="/auth" />} />
      <Route path="/applications" element={authed ? <Applications /> : <Navigate to="/auth" />} />
      <Route path="/recruiter" element={authed ? <RecruiterHub /> : <Navigate to="/auth" />} />
      <Route path="/company/:id" element={authed ? <Company /> : <Navigate to="/auth" />} />
      <Route path="/board" element={authed ? <Board /> : <Navigate to="/auth" />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}