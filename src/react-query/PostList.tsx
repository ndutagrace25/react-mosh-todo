import React from "react";
import usePosts from "./hooks/usePosts";
import { useState } from "react";

const PostList = () => {
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);

  const {
    data: posts,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = usePosts({ pageSize });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className="list-group">
        {posts.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((post) => (
              <li key={post.id} className="list-group-item">
                {post.title}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <div className="d-flex flex-row align-items-center my-3">
        <button
          className="btn btn-primary"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading.." : "Load More"}
        </button>
      </div>
    </>
  );
};

export default PostList;
