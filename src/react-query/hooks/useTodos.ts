import { useQuery } from "@tanstack/react-query";
import { CATCHE_KEY_TODOS } from "../constants";
import todoService, { Todo } from "../services/todoService";

const useTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: CATCHE_KEY_TODOS,
    queryFn: () => todoService.getAll(),
    staleTime: 10 * 1000,
  });
};

export default useTodos;
