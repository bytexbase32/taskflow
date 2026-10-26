import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { apiRequest } from "../api";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await apiRequest("/tasks/my-tasks");
                setTasks(data);
            } catch (err) {
                setError(err.message || "Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

    const [userName, setUserName] = useState(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.name || "User";
        } catch {
            return "User";
        }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = [
        {
            label: "Total tasks",
            value: tasks.length,
            color: "text-slate-900",
        },
        {
            label: "In progress",
            value: tasks.filter((task) => task.status === "IN_PROGRESS").length,
            color: "text-indigo-600",
        },
        {
            label: "Completed",
            value: tasks.filter((task) => task.status === "DONE").length,
            color: "text-green-600",
        },
        {
            label: "Overdue",
            value: tasks.filter(
                (task) =>
                    task.status !== "DONE" &&
                    task.dueDate &&
                    new Date(task.dueDate) < today,
            ).length,
            color: "text-red-600",
        },
    ];

    return (
        <AppLayout title="Dashboard">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">
                    Welcome back, {userName}!
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Here's an overview of your work.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg bg-white p-4 shadow-sm"
                        >
                            <p className="text-sm text-slate-500">
                                {stat.label}
                            </p>
                            <p
                                className={`mt-1 text-2xl font-semibold ${stat.color}`}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                <section className="mt-6 rounded-lg bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Recent tasks
                        </h3>
                        <Link
                            to="/tasks"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-4 py-3 font-medium">
                                        Task
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Priority
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Due date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-8 text-center text-slate-500"
                                        >
                                            Loading tasks...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-8 text-center text-red-600"
                                        >
                                            {error}
                                        </td>
                                    </tr>
                                ) : tasks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-8 text-center text-slate-500"
                                        >
                                            No tasks yet. Create a task to get
                                            started.
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.slice(0, 5).map((task) => (
                                        // Keep your existing task row here.
                                        <tr
                                            key={task.id}
                                            className="border-b border-slate-100 last:border-0"
                                        >
                                            <td className="px-4 py-4 font-medium text-slate-800">
                                                {task.title}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        task.status === "DONE"
                                                            ? "bg-green-100 text-green-700"
                                                            : task.status ===
                                                                "IN_PROGRESS"
                                                              ? "bg-indigo-100 text-indigo-700"
                                                              : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {task.status === "DONE"
                                                        ? "Completed"
                                                        : task.status ===
                                                            "IN_PROGRESS"
                                                          ? "In progress"
                                                          : "To do"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {task.priority}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {task.dueDate
                                                    ? new Date(
                                                          task.dueDate,
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
