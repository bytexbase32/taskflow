import ConfirmModal from "../components/ConfirmModal";
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
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [removingMember, setRemovingMember] = useState(false);

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

    async function handleRemoveMember() {
        if (!selectedTeam || !memberToRemove || removingMember) return;

        setRemovingMember(true);
        setError("");
        setSuccess("");

        try {
            await apiRequest(
                `/teams/${selectedTeam.id}/removeMember?user_id=${memberToRemove.id}`,
                { method: "POST" },
            );

            setMembers((currentMembers) =>
                currentMembers.filter(
                    (member) => member.id !== memberToRemove.id,
                ),
            );

            setSuccess("Member removed successfully.");
            setMemberToRemove(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setRemovingMember(false);
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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        My Teams
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Create teams and manage their tasks and members.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    Back to Dashboard
                </Link>
            </div>

            <section className="mt-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    Your teams
                </h2>

                {loading ? (
                    <p className="mt-3 text-slate-600">Loading teams...</p>
                ) : teams.length === 0 ? (
                    <p className="mt-3 text-slate-600">
                        No teams yet. Create your first team below.
                    </p>
                ) : (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team) => (
                            <article
                                key={team.id}
                                className="rounded-lg bg-white p-4 shadow-sm"
                            >
                                <h3 className="font-semibold text-slate-900">
                                    {team.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    {team.description || "No description"}
                                </p>
                                <Link
                                    to={`/tasks?teamId=${team.id}`}
                                    className="mt-3 inline-block text-sm font-semibold text-indigo-600"
                                >
                                    View tasks →
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleViewMembers(team)}
                                    className="mt-3 ml-4 text-sm font-semibold text-indigo-600"
                                >
                                    View members
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            {selectedTeam && (
                <section className="mt-6 rounded-lg bg-white p-4 shadow-sm">
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
                            className="mt-3 flex flex-col gap-3 sm:flex-row"
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
                        <p className="mt-3 text-slate-600">
                            Loading members...
                        </p>
                    ) : members.length === 0 ? (
                        <p className="mt-3 text-slate-600">No members found.</p>
                    ) : (
                        <ul className="mt-3 divide-y divide-slate-200">
                            {members.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex items-center justify-between py-2"
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
                                                        setMemberToRemove(
                                                            member,
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

            {error && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            )}
            {success && (
                <p role="status" className="mt-3 text-sm text-green-600">
                    {success}
                </p>
            )}

            <form
                onSubmit={handleCreateTeam}
                className="mt-5 max-w-xl rounded-lg bg-white p-4 shadow-sm"
            >
                <h2 className="text-base font-semibold text-slate-900">
                    Create a team
                </h2>

                <label
                    htmlFor="teamName"
                    className="mt-3 block text-sm font-medium text-slate-700"
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
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <label
                    htmlFor="teamDescription"
                    className="mt-3 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>
                <textarea
                    id="teamDescription"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What is this team working on?"
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                    {saving ? "Creating..." : "Create team"}
                </button>
            </form>
            <ConfirmModal
                isOpen={memberToRemove !== null}
                title="Remove team member?"
                message={
                    memberToRemove
                        ? `Are you sure you want to remove ${memberToRemove.name} from "${selectedTeam?.name}"?`
                        : ""
                }
                confirmText="Remove member"
                isDestructive
                isLoading={removingMember}
                onConfirm={handleRemoveMember}
                onCancel={() => {
                    if (!removingMember) setMemberToRemove(null);
                }}
            />
        </AppLayout>
    );
}
