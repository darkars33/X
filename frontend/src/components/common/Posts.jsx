import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {

  const getPostEndPoint= () =>{
	switch (feedType){
		case "forYou":
			return "/api/post/allPosts"
		case "following":
			return "/api/posts/followings"
		default:
			return "/api/posts/allPosts"			
	}
  }

  const Posts_EndPoint = getPostEndPoint();

  const {data:posts, isLoading, isError, error, refetch, isRefetching} = useQuery({
	queryKey : ["Posts"],
	queryFn: async () =>{
		try {
			const res= await fetch(Posts_EndPoint);
			const data= res.json();
			if(!res.ok){
				throw new Error(data.error);
			}
			return data;
		} catch (error) {
			throw new Error('An error occurred while fetching posts');
		}
	}
  })

  useEffect(() =>{
	refetch();
  }, [feedType, refetch])

  console.log(posts)

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
