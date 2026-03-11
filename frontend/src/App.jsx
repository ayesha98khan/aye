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

function Protected({ children }) {
  return token() ? children : <Navigate to="/auth" replace />;
}

function PublicOnly({ children }) {
  return token() ? <Navigate to="/feed" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={token() ? "/feed" : "/auth"} replace />} />

      <Route
        path="/auth"
        element={
          <PublicOnly>
            <Auth />
          </PublicOnly>
        }
      />

      <Route
        path="/forgot"
        element={
          <PublicOnly>
            <Forgot />
          </PublicOnly>
        }
      />

      <Route
        path="/feed"
        element={
          <Protected>
            <Feed />
          </Protected>
        }
      />

      <Route
        path="/profile"
        element={
          <Protected>
            <Profile />
          </Protected>
        }
      />

      <Route
        path="/applications"
        element={
          <Protected>
            <Applications />
          </Protected>
        }
      />

      <Route
        path="/recruiter"
        element={
          <Protected>
            <RecruiterHub />
          </Protected>
        }
      />

      <Route
        path="/company/:id"
        element={
          <Protected>
            <Company />
          </Protected>
        }
      />

      <Route
        path="/board"
        element={
          <Protected>
            <Board />
          </Protected>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
