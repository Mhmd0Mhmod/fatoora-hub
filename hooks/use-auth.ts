import { User } from "@/features/auth/types";
import { nextApi } from "@/lib/next-api";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => await nextApi.get<User>("/auth/me"),
    select: (data) => data.data,
    retry: false,
  });
  const { data: user, isLoading, isError, error, refetch } = query;
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
