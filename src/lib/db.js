import { useQuery } from "react-query";

export async function apiRequest(path, method = "GET", data) {
  return fetch(`/api/v1/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  .then((response) => response.json())
  .then((json) => {
    if (json && json.status && json.status == 'error') {
      return Promise.reject(json.message);
    } else {
      return Promise.resolve(json)
    }
  })
}


// get token metadata
export function useToken(id) {
  return useQuery([`${id}`], () => apiRequest(`${id}`), {
    enabled: !!id,
  });
}

// get updates for token
export function useUpdatesForToken(id) {
  return useQuery([`updates/${id}`], () => apiRequest(`updates/${id}`), {
    enabled: !!id,
  });
}
