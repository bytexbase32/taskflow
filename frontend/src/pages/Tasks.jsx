import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../api";

function toDisplayStatus(status) {
    const statuses = {
        TODO: "To do",
        IN_PROGRESS: "In progress",
        DONE: "Completed",
    };

    return statuses[status] ?? status;
}

function toDisplayPriority(priority) {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
}

function toApiStatus(status) {
    const statuses = {
        "To do": "TODO",
        "In progress": "IN_PROGRESS",
        Completed: "DONE",
    };

    return statuses[status] ?? status;
}

function formatDueDate(date) {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function Tasks() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("Medium");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState("");
    const [editTaskStatus, setEditTaskStatus] = useState("To do");
    const [editTaskPriority, setEditTaskPriority] = useState("Medium");
    const [editTaskDueDate, setEditTaskDueDate] = useState("");
    const [searchParams] = useSearchParams();
    const teamId = searchParams.get("teamId");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState("");
    const [selectedCreateTeamId, setSelectedCreateTeamId] = useState("");
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deletingTask, setDeletingTask] = useState(false);

    useEffect(() => {
        async function loadTasks() {
            if (!teamId) {
                setLoading(true);
                setError("");

                try {
                    const data = await apiRequest("/tasks/my-tasks");

                    setTasks(
                        data.map((task) => ({
                            ...task,
                            status: toDisplayStatus(task.status),
                            priority: toDisplayPriority(task.priority),
                        })),
                    );
                } catch (err) {
                    setTasks([]);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }

                return;
            }

            setLoading(true);
            setError("");

            try {
                const data = await apiRequest(
                    `/tasks?teamId=${encodeURIComponent(teamId)}`,
                );

                setTasks(
                    data.map((task) => ({
                        ...task,
                        status: toDisplayStatus(task.status),
                        priority: toDisplayPriority(task.priority),
                        dueDate: task.dueDate,
                    })),
                );
            } catch (err) {
                setTasks([]);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, [teamId]);

    useEffect(() => {
        async function loadTeams() {
            try {
                const data = await apiRequest("/teams");
                setTeams(data);
            } catch (err) {
                setTeamsError(err.message);
            } finally {
                setTeamsLoading(false);
            }
        }

        loadTeams();
    }, []);

    async function handleCreateTask(event) {
        event.preventDefault();

        const title = newTaskTitle.trim();

        const targetTeamId = teamId || selectedCreateTeamId;

        if (!title || !targetTeamId) {
            setError("Please enter a title and select a team.");
            return;
        }

        setError("");

        try {
            const createdTask = await apiRequest("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    priority: newTaskPriority.toUpperCase(),
                    teamId: Number(targetTeamId),
                    dueDate: newTaskDueDate
                        ? `${newTaskDueDate}T00:00:00`
                        : null,
                }),
            });

            setTasks((currentTasks) => [
                ...currentTasks,
                {
                    ...createdTask,
                    status: toDisplayStatus(createdTask.status),
                    priority: toDisplayPriority(createdTask.priority),
                },
            ]);

            setNewTaskTitle("");
            setNewTaskPriority("Medium");
            setNewTaskDueDate("");
            setShowCreateForm(false);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDeleteTask() {
        if (!taskToDelete || deletingTask) return;

        setDeletingTask(true);
        setError("");

        try {
            await apiRequest(`/tasks/${taskToDelete.id}`, {
                method: "DELETE",
            });

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskToDelete.id),
            );

            if (editingTaskId === taskToDelete.id) {
                setEditingTaskId(null);
                setEditTaskTitle("");
            }

            setTaskToDelete(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingTask(false);
        }
    }

    async function handleUpdateTask(event) {
        event.preventDefault();

        const title = editTaskTitle.trim();

        if (!title) {
            setError("Task title cannot be empty.");
            return;
        }

        setError("");

        try {
            let updatedTask = await apiRequest(`/tasks/${editingTaskId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title,
                    priority: editTaskPriority.toUpperCase(),
                    dueDate: editTaskDueDate
                        ? `${editTaskDueDate}T00:00:00`
                        : null,
                }),
            });

            if (updatedTask.status !== toApiStatus(editTaskStatus)) {
                updatedTask = await apiRequest(
                    `/tasks/${editingTaskId}/status?status=${toApiStatus(editTaskStatus)}`,
                    {
                        method: "PATCH",
                    },
                );
            }

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === editingTaskId
                        ? {
                              ...updatedTask,
                              status: toDisplayStatus(updatedTask.status),
                              priority: toDisplayPriority(updatedTask.priority),
                          }
                        : task,
                ),
            );

            setEditingTaskId(null);
            setEditTaskTitle("");
        } catch (err) {
            setError(err.message);

            try {
                const data = await apiRequest(
                    teamId
                        ? `/tasks?teamId=${encodeURIComponent(teamId)}`
                        : "/tasks/my-tasks",
                );

                setTasks(
                    data.map((task) => ({
                        ...task,
                        status: toDisplayStatus(task.status),
                        priority: toDisplayPriority(task.priority),
                    })),
                );
            } catch {
                // Keep the original error visible.
            }
        }
    }

    const stats = [
        { label: "Total tasks", value: tasks.length },
        {
            label: "In progress",
            value: tasks.filter((task) => task.status === "In progress").length,
        },
        {
            label: "Completed",
            value: tasks.filter((task) => task.status === "Completed").length,
        },
    ];

    const filteredTasks =
        activeFilter === "All"
            ? tasks
            : tasks.filter((task) => task.status === activeFilter);
    return (
        <AppLayout title="My Tasks">
            <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            My Tasks
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Manage and track your tasks here.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setEditingTaskId(null);
                            setEditTaskTitle("");
                            setShowCreateForm((current) => !current);
                        }}
                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        + Create task
                    </button>
                </div>
                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        <p>{error}</p>
                        <Link
                            to="/tasks"
                            className="mt-2 inline-block font-medium underline"
                        >
                            Choose another team
                        </Link>
                    </div>
                )}
                {showCreateForm && (
                    <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Create a new task
                        </h2>

                        <form className="mt-4" onSubmit={handleCreateTask}>
                            {!teamId && (
                                <>
                                    <label
                                        htmlFor="createTaskTeam"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Team
                                    </label>

                                    <select
                                        id="createTaskTeam"
                                        value={selectedCreateTeamId}
                                        onChange={(event) =>
                                            setSelectedCreateTeamId(
                                                event.target.value,
                                            )
                                        }
                                        required
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                                    >
                                        <option value="">Select a team</option>
                                        {teams.map((team) => (
                                            <option
                                                key={team.id}
                                                value={team.id}
                                            >
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                            <label
                                htmlFor="taskTitle"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Task title
                            </label>
                            <input
                                id="taskTitle"
                                type="text"
                                placeholder="Enter task title"
                                value={newTaskTitle}
                                onChange={(event) =>
                                    setNewTaskTitle(event.target.value)
                                }
                                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            <label
                                htmlFor="taskPriority"
                                className="mt-4 block text-sm font-medium text-slate-700"
                            >
                                Priority
                            </label>
                            <select
                                id="taskPriority"
                                value={newTaskPriority}
                                onChange={(event) =>
                                    setNewTaskPriority(event.target.value)
                                }
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <label
                                htmlFor="taskDueDate"
                                className="mt-4 block text-sm font-medium text-slate-700"
                            >
                                Due date
                            </label>
                            <input
                                id="taskDueDate"
                                type="date"
                                value={newTaskDueDate}
                                onChange={(event) =>
                                    setNewTaskDueDate(event.target.value)
                                }
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            <button
                                type="submit"
                                className="mt-4 mr-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Create task
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
                {editingTaskId !== null && (
                    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Edit task
                        </h2>

                        <form className="mt-4" onSubmit={handleUpdateTask}>
                            <label
                                htmlFor="editTaskTitle"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Task title
                            </label>

                            <input
                                id="editTaskTitle"
                                type="text"
                                value={editTaskTitle}
                                onChange={(event) =>
                                    setEditTaskTitle(event.target.value)
                                }
                                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                            <label className="block">
                                <span className="mb-1 block text-sm font-medium">
                                    Status
                                </span>
                                <select
                                    value={editTaskStatus}
                                    onChange={(event) =>
                                        setEditTaskStatus(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="To do">To do</option>
                                    <option value="In progress">
                                        In progress
                                    </option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-1 block text-sm font-medium">
                                    Priority
                                </span>
                                <select
                                    value={editTaskPriority}
                                    onChange={(event) =>
                                        setEditTaskPriority(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-1 block text-sm font-medium">
                                    Due date
                                </span>
                                <input
                                    type="date"
                                    value={editTaskDueDate}
                                    onChange={(event) =>
                                        setEditTaskDueDate(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </label>

                            <button
                                type="submit"
                                className="mt-4 mr-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Save changes
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingTaskId(null);
                                    setEditTaskTitle("");
                                }}
                                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm text-slate-500">
                                {stat.label}
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveFilter("All")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            activeFilter === "All"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        All
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("To do")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            activeFilter === "To do"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        To do
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("In progress")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            activeFilter === "In progress"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        In progress
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("Completed")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            activeFilter === "Completed"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        Completed
                    </button>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                    Showing {filteredTasks.length}{" "}
                    {filteredTasks.length === 1 ? "task" : "tasks"}
                </p>
                <section className="mt-4 overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-3 py-2 font-medium">
                                        Task
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                        Status
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                        Priority
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                        Due date
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-t border-slate-100"
                                        >
                                            <td className="px-3 py-3 font-medium text-slate-800">
                                                {task.title}
                                            </td>

                                            <td className="px-3 py-3">
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

                                            <td className="px-3 py-3">
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        task.priority === "High"
                                                            ? "text-red-600"
                                                            : task.priority ===
                                                                "Medium"
                                                              ? "text-amber-600"
                                                              : "text-slate-500"
                                                    }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </td>

                                            <td className="px-3 py-3 text-slate-600">
                                                {formatDueDate(task.dueDate)}
                                            </td>
                                            <td className="px-3 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowCreateForm(
                                                            false,
                                                        );
                                                        setEditingTaskId(
                                                            task.id,
                                                        );
                                                        setEditTaskTitle(
                                                            task.title,
                                                        );
                                                        setEditTaskStatus(
                                                            task.status,
                                                        );
                                                        setEditTaskPriority(
                                                            task.priority,
                                                        );
                                                        setEditTaskDueDate(
                                                            task.dueDate
                                                                ? task.dueDate.slice(
                                                                      0,
                                                                      10,
                                                                  )
                                                                : "",
                                                        );
                                                    }}
                                                    className="mr-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setTaskToDelete(task)
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center"
                                        >
                                            <p className="text-sm font-medium text-gray-900">
                                                No tasks found
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing the filter or
                                                create a new task.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveFilter("All")
                                                }
                                                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                            >
                                                Clear filter
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </>
            <ConfirmModal
                isOpen={taskToDelete !== null}
                title="Delete task?"
                message={
                    taskToDelete
                        ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete task"
                isDestructive
                isLoading={deletingTask}
                onConfirm={handleDeleteTask}
                onCancel={() => {
                    if (!deletingTask) setTaskToDelete(null);
                }}
            />
        </AppLayout>
    );
}
