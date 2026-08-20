import api from "./api";

// Get dashboard statistics
export async function getDashboardStats() {
    const response = await api.get("/api/todos/stats");

    return response.data;
}
