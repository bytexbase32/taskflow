import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../api";
export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setError("");

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 8 || password.length > 72) {
            setError("Password must be between 8 and 72 characters.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const responseBody = await response.json().catch(() => null);

            if (!response.ok) {
                console.error(
                    "Registration error:",
                    response.status,
                    responseBody,
                );

                setError(
                    response.status === 409
                        ? "An account with this email already exists."
                        : responseBody?.message ||
                              "Registration failed. Please check your details and try again.",
                );
                return;
            }

            navigate("/login", {
                state: { registrationSuccess: true },
            });
        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Create account
                </h1>
                <p className="mt-2 text-slate-600">
                    Get started with TaskFlow.
                </p>
                {error && (
                    <p className="mt-4 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
                <form className="mt-8 space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium"
                        >
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            required
                            maxLength={100}
                            autoComplete="name"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                            placeholder="you@example.com"
                            value={email}
                            required
                            maxLength={255}
                            autoComplete="email"
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
                            placeholder="At least 8 characters"
                            value={password}
                            required
                            minLength={8}
                            maxLength={72}
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}
