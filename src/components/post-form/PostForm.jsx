import React, { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "draft",
      featuredImage: post?.featuredImage || null,
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.user);

  const submit = async (data) => {
    try {
      let file;

      if (data.image?.[0]) {
        file = await appwriteService.uploadFile(data.image[0]);

        if (post?.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        data.featuredImage = file.$id;
      }

      let dbPost;
      if (post) {
        dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: data.featuredImage,
        });
      } else {
        dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
      }

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } catch (err) {
      console.error("❌ Post submission failed:", err);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value.trim().replace(/\s+/g, "-").toLowerCase();
    } else {
      return "";
    }
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-blue-50 shadow-xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {post ? "✏️ Edit Your Post" : "📝 Create a New Post"}
      </h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Title</label>
          <Input
            type="text"
            placeholder="Enter post title"
            {...register("title", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Slug</label>
          <Input
            type="text"
            placeholder="post-title-slug"
            {...register("slug", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Content</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RTE {...field} placeholder="Write your amazing content..." />
            )}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Status</label>
          <Select
            {...register("status")}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
          />
        </div>

        {/* Featured Image */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Featured Image</label>
          <Input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full p-3 border border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition"
          />

          {post?.featuredImage && (
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt="Featured Preview"
              className="mt-4 rounded-2xl shadow-md max-h-60 object-cover border border-gray-200"
            />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transform transition-all"
        >
          {post ? "💾 Update Post" : "🚀 Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default PostForm;
