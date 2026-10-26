import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
    {
        section: "Workspace",
        items: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "My Tasks", path: "/tasks" },
            { label: "Teams", path: "/teams" },
        ],
    },
    {
        section: "Preferences",
        items: [{ label: "Settings", path: "/settings" }],
    },
];

export default function AppLayout({ children, title, actions }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    function isActive(path) {
        if (path === "/tasks") {
            return location.pathname === "/tasks";
        }

        return location.pathname === path;
    }

    const userName = (() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.name || "User";
        } catch {
            return "User";
        }
    })();

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
                } fixed inset-y-0 left-0 z-50 w-56 bg-slate-900 text-white md:sticky md:top-0 md:block md:h-screen`}
            >
                <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
                    <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-xl font-bold tracking-tight"
                    >
                        Task<span className="text-indigo-400">Flow</span>
                    </Link>

                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
                    >
                        ✕
                    </button>
                </div>

                <nav className="space-y-1 px-3 py-5">
                    {navigation.map((group) => (
                        <div key={group.section} className="mb-6">
                            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {group.section}
                            </p>

                            {group.items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`mb-1 block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        isActive(item.path)
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Toggle navigation menu"
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

                        <h1 className="text-lg font-semibold text-slate-800">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {actions}
                        <button
                            type="button"
                            aria-label={`User profile: ${userName}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200"
                        >
                            {userName.charAt(0).toUpperCase()}
                        </button>
                    </div>
                </header>

                <main className="p-4 lg:p-5 xl:p-6">{children}</main>
            </div>
        </div>
    );
}
