import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "./useTodos";
import axios from "axios";
import { CATCHE_KEY_TODOS } from "../constants";
import APIClient from "../services/apiClient";

interface AddTodoContext {
  previousTodos: Todo[];
}
const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();
  const apiClient = new APIClient<Todo>(`/todos`);

  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: apiClient.post,
    onMutate: (newTodo: Todo) => {
      const previousTodos =
        queryClient.getQueryData<Todo[]>(CATCHE_KEY_TODOS) || [];
      queryClient.setQueryData<Todo[]>(CATCHE_KEY_TODOS, (todos = []) => [
        newTodo,
        ...todos,
      ]);
      onAdd();
      return { previousTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      // APPROACH 1: Invalidate the cache;
      // queryClient.invalidateQueries({
      //   queryKey: CATCHE_KEY_TODOS,
      // });
      // APPROACH 2: Updating the data in the cache directly
      queryClient.setQueryData<Todo[]>(CATCHE_KEY_TODOS, (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
      // if (ref.current) {
      //   ref.current.value = "";
      // }
    },
    onError: (error, newTodo, context) => {
      if (!context) return;

      queryClient.setQueryData<Todo[]>(CATCHE_KEY_TODOS, context.previousTodos);
    },
  });
};

export default useAddTodo;
