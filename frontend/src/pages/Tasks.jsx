import { Link } from "react-router-dom";

export default function Tasks() {
    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <Link
                to="/dashboard"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">My Tasks</h1>

            <p className="mt-2 text-slate-600">
                Manage and track your tasks here.
            </p>
        </main>
    );
}
