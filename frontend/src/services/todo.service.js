import api from "./api";

// Get all todos
export async function getTodos(params = {}) {
    console.log("Calling:", api.defaults.baseURL + "/api/todos");

    const response = await api.get("/api/todos", {
        params,
    });

    console.log("Response:", response);

    return response.data;
}

// Get single todo
export async function getTodo(id) {
    const response = await api.get(`/api/todos/${id}`);
    return response.data;
}

// Create todo
export async function createTodo(data) {
    const response = await api.post("/api/todos", data);
    return response.data;
}

// Update todo
export async function updateTodo(id, data) {
    const response = await api.put(`/api/todos/${id}`, data);
    return response.data;
}

// Delete todo
export async function deleteTodo(id) {
    const response = await api.delete(`/api/todos/${id}`);
    return response.data;
}
