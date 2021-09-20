export async function apiRequest(path, method = "GET", data) {
  return fetch(`/api/v1/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  .then((response) => response.json());
}
