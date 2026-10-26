import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Teams from "./pages/Teams";

function RequireAuth({ children }) {
    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/teams"
                element={
                    <RequireAuth>
                        <Teams />
                    </RequireAuth>
                }
            />
            <Route
                path="/tasks"
                element={
                    <RequireAuth>
                        <Tasks />
                    </RequireAuth>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
