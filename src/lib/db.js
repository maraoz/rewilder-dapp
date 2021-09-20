import { useQuery } from "react-query";
import { apiRequest } from "./util";

// Get token
export function useToken(id) {
  return useQuery([`api/v1/${id}`], () => apiRequest(`${id}`), {
    enabled: !!id,
  });
}
