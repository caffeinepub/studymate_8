import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Textbook, Video } from "../backend.d";
import { useActor } from "./useActor";

export function useGetVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[bigint, Video]>>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublishedVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[bigint, Textbook]>>({
    queryKey: ["books"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTextbooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (video: Video) => {
      if (!actor) throw new Error("Not connected");
      return actor.insertVideo(video);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useAddBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (book: Textbook) => {
      if (!actor) throw new Error("Not connected");
      return actor.insertTextbook(book);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}
