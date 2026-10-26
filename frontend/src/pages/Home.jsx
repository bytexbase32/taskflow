import { Link } from "react-router-dom";

const features = [
    {
        number: "01",
        title: "Task management",
        description:
            "Create tasks, assign priorities, update statuses, and keep your work organized in one place.",
    },
    {
        number: "02",
        title: "Team collaboration",
        description:
            "Create teams, manage memberships, and organize tasks around shared work.",
    },
    {
        number: "03",
        title: "Progress tracking",
        description:
            "See task totals, completed work, and overdue items through a dashboard connected to the backend.",
    },
];

const technologies = [
    "React",
    "Tailwind CSS",
    "Java 25",
    "Spring Boot",
    "PostgreSQL",
    "Docker",
];

function DashboardPreview() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-3 text-xs font-medium text-slate-400">
                    TaskFlow / Dashboard
                </span>
            </div>

            <div className="grid min-h-72 grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr]">
                <aside className="border-r border-slate-100 bg-slate-50 p-3 sm:p-4">
                    <p className="mb-5 text-xs font-bold text-indigo-600">
                        TaskFlow
                    </p>
                    {["Dashboard", "My Tasks", "Teams", "Settings"].map(
                        (item, index) => (
                            <div
                                key={item}
                                className={`mb-2 rounded-lg px-2 py-2 text-xs ${
                                    index === 0
                                        ? "bg-indigo-100 font-semibold text-indigo-700"
                                        : "text-slate-500"
                                }`}
                            >
                                {item}
                            </div>
                        ),
                    )}
                </aside>

                <div className="min-w-0 p-4 sm:p-6">
                    <p className="text-xs text-slate-400">WORKSPACE</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                        Dashboard
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        An overview of your tasks
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                        {[
                            ["Total", "12"],
                            ["In progress", "5"],
                            ["Completed", "7"],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-xl border border-slate-100 p-2 sm:p-3"
                            >
                                <p className="text-[10px] leading-4 text-slate-500 sm:text-xs">
                                    {label}
                                </p>
                                <p className="mt-1 text-xl font-bold text-slate-900">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-100 p-3 sm:p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-800">
                                Recent tasks
                            </p>
                            <span className="text-[10px] text-indigo-600">
                                Preview
                            </span>
                        </div>
                        {[
                            ["Build the dashboard", "Completed", "bg-emerald-100 text-emerald-700"],
                            ["Connect the API", "In progress", "bg-blue-100 text-blue-700"],
                            ["Review team tasks", "To do", "bg-amber-100 text-amber-700"],
                        ].map(([task, status, style]) => (
                            <div
                                key={task}
                                className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 py-3"
                            >
                                <span className="text-xs text-slate-700">
                                    {task}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${style}`}
                                >
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden bg-white text-slate-900">
            <header className="border-b border-slate-100">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-bold tracking-tight"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            ✓
                        </span>
                        TaskFlow
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Get started
                        </Link>
                    </div>
                </nav>
            </header>

            <section className="relative">
                <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100/70 blur-3xl" />

                <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                            A full-stack portfolio project
                        </span>

                        <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Organize tasks.
                            <span className="block text-indigo-600">
                                Move work forward.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                            TaskFlow is a project management application I
                            built to explore full-stack development, from a
                            React interface to a Spring Boot API and PostgreSQL
                            database.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Try the application <span aria-hidden="true">→</span>
                            </Link>
                            <a
                                href="#project"
                                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Explore the project
                            </a>
                        </div>

                        <p className="mt-5 text-xs leading-5 text-slate-500">
                            Built as a personal project to practise frontend,
                            backend, database, and containerization skills.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-3xl bg-indigo-100/60 blur-2xl" />
                        <div className="relative">
                            <DashboardPreview />
                        </div>
                    </div>
                </div>
            </section>

            <section id="project" className="border-y border-slate-100 bg-slate-50/70">
                <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold text-indigo-600">
                            WHAT I BUILT
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            More than a static interface
                        </h2>
                        <p className="mt-4 leading-7 text-slate-600">
                            TaskFlow connects the user interface to a backend
                            and database, with features for managing work and
                            collaborating through teams.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {features.map((feature) => (
                            <article
                                key={feature.number}
                                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                                    {feature.number}
                                </span>
                                <h3 className="mt-5 text-lg font-bold">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600">
                            THE TECH STACK
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight">
                            Built across the full stack
                        </h2>
                        <p className="mt-4 leading-7 text-slate-600">
                            The project brings together a modern frontend,
                            a Java backend, persistent data storage, and a
                            containerized development environment.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {technologies.map((technology) => (
                            <span
                                key={technology}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-5 pb-16 sm:px-8 sm:pb-20">
                <div className="mx-auto max-w-6xl rounded-3xl bg-slate-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
                    <p className="text-sm font-semibold text-indigo-300">
                        EXPLORE TASKFLOW
                    </p>
                    <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                        See the project in action
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
                        Create an account to explore task management,
                        teams, and the dashboard.
                    </p>
                    <Link
                        to="/register"
                        className="mt-7 inline-flex rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                        Get started <span aria-hidden="true" className="ml-2">→</span>
                    </Link>
                </div>
            </section>

            <footer className="border-t border-slate-100">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <span className="font-semibold text-slate-700">
                        TaskFlow
                    </span>
                    <p>A personal full-stack project built for my portfolio.</p>
                </div>
            </footer>
        </main>
    );
}