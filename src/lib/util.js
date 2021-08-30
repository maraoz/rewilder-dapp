export async function apiRequest(path, method = "GET", data) {
  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status === "error") {
        const error = new Error(response.message);
        error.code = response.code;
        throw new error();
      } else {
        return response.data;
      }
    });
}
