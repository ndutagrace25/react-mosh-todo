import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATCHE_KEY_TODOS } from "../constants";
import todoService, { Todo } from "../services/todoService";

interface AddTodoContext {
  previousTodos: Todo[];
}
const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: todoService.post,
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
