import axios from "axios";
import usePosts from "./hooks/usePosts";
import { useState } from "react";

const PostList = () => {
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);

  const { data: posts, error, isLoading } = usePosts({ page, pageSize });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className="list-group">
        {posts?.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>
      <div className="d-flex flex-row align-items-center my-3">
        <button
          disabled={page === 1}
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="mx-3">{page}</span>
        <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </>
  );
};

export default PostList;
