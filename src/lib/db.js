import { useQuery } from "react-query";
import { apiRequest } from "./util";

// Get token
export function useToken(id) {
  return useQuery(["token", { id }], () => apiRequest(`token?id=${id}`), {
    enabled: !!id,
  });
}

// Get all tokens
export function useAllTokens() {
  return useQuery(["tokens"], () => apiRequest(`tokens`));
}
