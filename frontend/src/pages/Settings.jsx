
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function Settings() {
    const navigate = useNavigate();

    let user = {};

    try {
        user = JSON.parse(localStorage.getItem("user") || "{}") || {};
    } catch {
        user = {};
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    }

    return (
        <AppLayout title="Settings">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Settings
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your account and application preferences.
                    </p>
                </div>

                <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="mb-5">
                        <h3 className="text-base font-semibold text-slate-900">
                            Account information
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Your current TaskFlow account details.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Name
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {user.name || "Not available"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Email
                            </p>
                            <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                                {user.email || "Not available"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            Appearance
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            TaskFlow currently uses the light theme.
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-4">
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Color theme
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Default application appearance
                            </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
                            Light
                        </span>
                    </div>
                </section>

                <section className="rounded-xl border border-red-100 bg-white p-5 sm:p-6">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            Session
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Log out of your current TaskFlow session on this
                            browser.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Log out
                    </button>
                </section>
            </div>
        </AppLayout>
    );
}
