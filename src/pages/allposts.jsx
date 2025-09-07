import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((result) => {
      setPosts(result || []); // result is already an array
    });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        {posts.length === 0 ? (
          <h2 className="text-center text-gray-600">No posts found.</h2>
        ) : (
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default AllPosts;
