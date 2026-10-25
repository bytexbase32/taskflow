import { useState } from "react";
import { Link } from "react-router-dom";

export default function Tasks() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("Medium");
    const [newTaskStatus, setNewTaskStatus] = useState("To do");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState("");
    const [editTaskStatus, setEditTaskStatus] = useState("To do");
    const [editTaskPriority, setEditTaskPriority] = useState("Medium");
    const [editTaskDueDate, setEditTaskDueDate] = useState("");

    function formatDueDate(date) {
        if (!date || date === "Not set") {
            return "Not set";
        }

        // Existing mock dates are already formatted.
        if (date.includes(",")) {
            return date;
        }

        const parsedDate = new Date(`${date}T00:00:00`);

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function handleCreateTask(event) {
        event.preventDefault();

        const title = newTaskTitle.trim();

        if (!title) return;

        const newTask = {
            id: crypto.randomUUID(),
            title: title,
            status: newTaskStatus,
            priority: newTaskPriority,
            dueDate: newTaskDueDate || "Not set",
        };

        setTasks((currentTasks) => [...currentTasks, newTask]);
        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskStatus("To do");
        setNewTaskDueDate("");
        setShowCreateForm(false);
    }

    function handleDeleteTask(taskId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?",
        );

        if (!confirmed) return;

        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== taskId),
        );

        if (editingTaskId === taskId) {
            setEditingTaskId(null);
            setEditTaskTitle("");
        }
    }

    const [tasks, setTasks] = useState([
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
        {
            id: 4,
            title: "Write API documentation",
            status: "To do",
            priority: "Medium",
            dueDate: "Nov 5, 2026",
        },
    ]);

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
        <main className="min-h-screen bg-slate-100 p-6">
            <Link
                to="/dashboard"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
                ← Back to Dashboard
            </Link>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Tasks
                    </h1>
                    <p className="mt-2 text-slate-600">
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
            {showCreateForm && (
                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Create a new task
                    </h2>

                    <form className="mt-4" onSubmit={handleCreateTask}>
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
                            htmlFor="taskStatus"
                            className="mt-4 block text-sm font-medium text-slate-700"
                        >
                            Status
                        </label>
                        <select
                            id="taskStatus"
                            value={newTaskStatus}
                            onChange={(event) =>
                                setNewTaskStatus(event.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="To do">To do</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
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

                    <form
                        className="mt-4"
                        onSubmit={(event) => {
                            event.preventDefault();

                            const title = editTaskTitle.trim();
                            if (!title) return;

                            setTasks((currentTasks) =>
                                currentTasks.map((task) =>
                                    task.id === editingTaskId
                                        ? {
                                              ...task,
                                              title: editTaskTitle.trim(),
                                              status: editTaskStatus,
                                              priority: editTaskPriority,
                                              dueDate:
                                                  editTaskDueDate || "Not set",
                                          }
                                        : task,
                                ),
                            );

                            setEditingTaskId(null);
                            setEditTaskTitle("");
                        }}
                    >
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
                                <option value="In progress">In progress</option>
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
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl bg-white p-6 shadow-sm"
                    >
                        <p className="text-sm text-slate-500">{stat.label}</p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
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

            <p className="mt-6 text-sm text-slate-500">
                Showing {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"}
            </p>
            <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Task</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Priority
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Due date
                                </th>
                                <th className="px-4 py-3 font-medium">
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
                                        <td className="px-4 py-4 font-medium text-slate-800">
                                            {task.title}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    task.status === "Completed"
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

                                        <td className="px-4 py-4">
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

                                        <td className="px-4 py-4 text-slate-600">
                                            {formatDueDate(task.dueDate)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateForm(false);
                                                    setEditingTaskId(task.id);
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
                                                        task.dueDate ===
                                                            "Not set"
                                                            ? ""
                                                            : task.dueDate.includes(
                                                                    ",",
                                                                )
                                                              ? new Date(
                                                                    task.dueDate,
                                                                )
                                                                    .toISOString()
                                                                    .slice(
                                                                        0,
                                                                        10,
                                                                    )
                                                              : task.dueDate,
                                                    );
                                                }}
                                                className="mr-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
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
                                            Try changing the filter or create a
                                            new task.
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
        </main>
    );
}
