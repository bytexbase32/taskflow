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
