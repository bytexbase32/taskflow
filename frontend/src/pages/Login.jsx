import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const registrationSuccess = location.state?.registrationSuccess;

    async function handleLogin(event) {
        event.preventDefault();
        setError("");

        if (isSubmitting) return;

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const responseBody = await response.json().catch(() => null);

            if (!response.ok) {
                setError("Invalid email or password.");
                return;
            }

            if (!responseBody?.token || !responseBody?.user) {
                setError("The server returned an invalid login response.");
                return;
            }

            // Temporary token storage; we'll improve session security later.
            localStorage.setItem("token", responseBody.token);
            localStorage.setItem("user", JSON.stringify(responseBody.user));

            navigate("/dashboard", { replace: true });
        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">TaskFlow</h1>
                <p className="mt-2 text-slate-600">
                    Sign in to manage your team's tasks.
                </p>

                {registrationSuccess && (
                    <p className="mt-4 text-sm text-green-700" role="status">
                        Account created successfully. You can now sign in.
                    </p>
                )}

                {error && (
                    <p className=" mt-4 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
                <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            placeholder="Your password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}{" "}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Create one
                    </Link>
                </p>
            </section>
        </main>
    );
}
