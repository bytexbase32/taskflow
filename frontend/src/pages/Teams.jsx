import AppLayout from "../components/AppLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let ignore = false;

        async function fetchTeams() {
            try {
                const data = await apiRequest("/teams");

                if (!ignore) {
                    setTeams(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        fetchTeams();

        return () => {
            ignore = true;
        };
    }, []);

    async function handleViewMembers(team) {
        setSelectedTeam(team);
        setMembers([]);
        setMembersLoading(true);
        setError("");

        try {
            const data = await apiRequest(`/teams/${team.id}/members`);
            setMembers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setMembersLoading(false);
        }
    }

    async function handleAddMember(event) {
        event.preventDefault();

        if (!selectedTeam || !memberEmail.trim()) return;

        setAddingMember(true);
        setError("");
        setSuccess("");

        try {
            await apiRequest(`/teams/${selectedTeam.id}/members`, {
                method: "POST",
                body: JSON.stringify({
                    email: memberEmail.trim(),
                }),
            });

            setMemberEmail("");
            setSuccess("Member added successfully.");
            await handleViewMembers(selectedTeam);
        } catch (err) {
            setError(err.message);
        } finally {
            setAddingMember(false);
        }
    }

    async function handleRemoveMember(userId) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this member from the team?",
        );

        if (!confirmed) return;

        if (!selectedTeam) return;

        setError("");
        setSuccess("");

        try {
            await apiRequest(
                `/teams/${selectedTeam.id}/removeMember?user_id=${userId}`,
                { method: "POST" },
            );

            await handleViewMembers(selectedTeam);
            setSuccess("Member removed successfully.");
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleCreateTeam(event) {
        event.preventDefault();

        if (!name.trim()) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const team = await apiRequest("/teams", {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                }),
            });

            setTeams((current) => [...current, team]);
            setSuccess("Team created successfully.");
            setName("");
            setDescription("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AppLayout title="Teams">
            <Link
                to="/dashboard"
                className="text-sm font-medium text-indigo-600"
            >
                ← Back to Dashboard
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">My Teams</h1>
            <p className="mt-2 text-slate-600">
                Create a team and manage its tasks.
            </p>

            {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}
            {success && (
                <p role="status" className="mt-4 text-sm text-green-600">
                    {success}
                </p>
            )}

            <form
                onSubmit={handleCreateTeam}
                className="mt-6 max-w-xl rounded-xl bg-white p-6 shadow-sm"
            >
                <h2 className="text-lg font-semibold">Create a team</h2>

                <label
                    htmlFor="teamName"
                    className="mt-4 block text-sm font-medium text-slate-700"
                >
                    Team name
                </label>
                <input
                    id="teamName"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Development Team"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <label
                    htmlFor="teamDescription"
                    className="mt-4 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>
                <textarea
                    id="teamDescription"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What is this team working on?"
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
                >
                    {saving ? "Creating..." : "Create team"}
                </button>
            </form>

            <section className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900">
                    Your teams
                </h2>

                {loading ? (
                    <p className="mt-4 text-slate-600">Loading teams...</p>
                ) : teams.length === 0 ? (
                    <p className="mt-4 text-slate-600">
                        No teams yet. Create your first team above.
                    </p>
                ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team) => (
                            <article
                                key={team.id}
                                className="rounded-xl bg-white p-5 shadow-sm"
                            >
                                <h3 className="font-semibold text-slate-900">
                                    {team.name}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    {team.description || "No description"}
                                </p>
                                <Link
                                    to={`/tasks?teamId=${team.id}`}
                                    className="mt-4 inline-block text-sm font-semibold text-indigo-600"
                                >
                                    View tasks →
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleViewMembers(team)}
                                    className="mt-4 ml-4 text-sm font-semibold text-indigo-600"
                                >
                                    View members
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            {selectedTeam && (
                <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Members — {selectedTeam.name}
                    </h2>
                    {members.some(
                        (member) =>
                            member.role === "OWNER" &&
                            member.id ===
                                JSON.parse(localStorage.getItem("user") || "{}")
                                    .id,
                    ) && (
                        <form
                            onSubmit={handleAddMember}
                            className="mt-4 flex flex-col gap-3 sm:flex-row"
                        >
                            <input
                                type="email"
                                required
                                value={memberEmail}
                                onChange={(event) =>
                                    setMemberEmail(event.target.value)
                                }
                                placeholder="Enter member's email"
                                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2"
                            />

                            <button
                                type="submit"
                                disabled={addingMember}
                                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
                            >
                                {addingMember ? "Adding..." : "Add member"}
                            </button>
                        </form>
                    )}

                    {membersLoading ? (
                        <p className="mt-4 text-slate-600">
                            Loading members...
                        </p>
                    ) : members.length === 0 ? (
                        <p className="mt-4 text-slate-600">No members found.</p>
                    ) : (
                        <ul className="mt-4 divide-y divide-slate-200">
                            {members.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {member.name}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {member.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                            {member.role}
                                        </span>

                                        {members.some(
                                            (item) =>
                                                item.role === "OWNER" &&
                                                item.id ===
                                                    JSON.parse(
                                                        localStorage.getItem(
                                                            "user",
                                                        ) || "{}",
                                                    ).id,
                                        ) &&
                                            member.role !== "OWNER" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member.id,
                                                        )
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </AppLayout>
    );
}
