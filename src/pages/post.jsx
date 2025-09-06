import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import {Container} from "../components";
import {Button} from "../components";
import parse from "html-react-parser";

function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [post, setPost] = useState(null);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((res) => {
        if (res) {
          setPost(res);
        } else {
          navigate("/");
        }
      });
    }
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  if (!post) {
    return (
      <div className="py-20 text-center text-gray-600 text-xl">Loading...</div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        {/* Featured Image */}
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg mb-8 relative group">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isAuthor && (
            <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500 hover:bg-green-600 shadow-md">
                  ✏️ Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500 hover:bg-red-600 shadow-md"
                onClick={deletePost}
              >
                🗑️ Delete
              </Button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
            <img
              src={`https://ui-avatars.com/api/?name=${userData?.name || "A"}`}
              alt="author"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{userData?.name || "Anonymous"}</p>
              <p>{new Date(post.$createdAt).toDateString()}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {parse(post.content)}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Post;
