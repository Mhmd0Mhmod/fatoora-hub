import { User } from "@/features/auth/types";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/auth/me"),
    retry: false,
  });
  const { data: user, isLoading, isError, error, refetch } = query;
  console.log(query);
  const isAuthenticated = !!user;

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    isError,
    error,
    refetch,
  };
}
