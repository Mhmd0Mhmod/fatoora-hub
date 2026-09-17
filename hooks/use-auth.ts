import { User } from "@/features/auth/types";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get<User>("/auth/me");
      return response.data;
    },
    retry: false,
  });

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
