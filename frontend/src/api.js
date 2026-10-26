const API_URL = "http://localhost:8080/api/v1";

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    // The session has expired or the token is no longer valid.
    // Don't interfere with login or registration errors.
    const isAuthEndpoint =
        path.startsWith("/auth/login") ||
        path.startsWith("/auth/register");

    if (response.status === 401 && token && !isAuthEndpoint) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
        ) {
            window.location.replace("/login?session=expired");
        }
    }

    if (response.status === 204) {
        return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
                data?.error ||
                data?.detail ||
                JSON.stringify(data) ||
                `Request failed (${response.status})`,
        );
    }

    return data;
}