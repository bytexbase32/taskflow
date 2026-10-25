import { useState } from "react";

export default function Dashboard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [userName, setUserName] = useState(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.name || "User";
        } catch {
            return "User";
        }
    });

    const stats = [
        { label: "Total tasks", value: 24, color: "text-slate-900" },
        { label: "In progress", value: 8, color: "text-indigo-600" },
        { label: "Completed", value: 12, color: "text-green-600" },
        { label: "Overdue", value: 4, color: "text-red-600" },
    ];

    const tasks = [
        {
            id: 1,
            title: "Design dashboard",
            status: "In progress",
            priority: "High",
            dueDate: "Oct 28, 2026",
        },
        {
            id: 2,
            title: "Implement authentication",
            status: "Completed",
            priority: "Medium",
            dueDate: "Oct 24, 2026",
        },
        {
            id: 3,
            title: "Add team management",
            status: "To do",
            priority: "Low",
            dueDate: "Nov 2, 2026",
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            {isMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
                />
            )}
            <aside
                className={`${
                    isMenuOpen ? "block" : "hidden"
                } fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white md:sticky md:top-0 md:block md:h-screen`}
            >
                <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
                    <h1 className="text-xl font-bold tracking-tight">
                        Task<span className="text-indigo-400">Flow</span>
                    </h1>

                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
                    >
                        ✕
                    </button>
                </div>

                <nav className="space-y-1 px-3 py-6">
                    <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>

                    <a
                        href="/dashboard"
                        className="block rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/tasks"
                        className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        My Tasks
                    </a>

                    <a
                        href="/teams"
                        className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        Teams
                    </a>

                    <div className="pt-6">
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Preferences
                        </p>

                        <a
                            href="/settings"
                            className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Settings
                        </a>
                    </div>
                </nav>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Open navigation menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <h2 className="text-lg font-semibold text-slate-800">
                            Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            type="button"
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:px-4"
                        >
                            +{" "}
                            <span className="hidden sm:inline">
                                Create task
                            </span>
                            <span className="sm:hidden">Create</span>
                        </button>

                        <button
                            type="button"
                            aria-label={`User profile: ${userName}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200"
                        >
                            {userName.charAt(0).toUpperCase()}
                        </button>
                    </div>
                </header>

                <main className="p-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Welcome back, {userName}!
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Here's an overview of your work.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl bg-white p-6 shadow-sm"
                            >
                                <p className="text-sm text-slate-500">
                                    {stat.label}
                                </p>
                                <p
                                    className={`mt-2 text-3xl font-bold ${stat.color}`}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <section className="mt-10 rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Recent tasks
                            </h3>

                            <a
                                href="/tasks"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                View all
                            </a>
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
                                    {tasks.map((task) => (
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
                                                        task.status ===
                                                        "Completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : task.status ===
                                                                "In progress"
                                                              ? "bg-indigo-100 text-indigo-700"
                                                              : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {task.priority}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {task.dueDate}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
