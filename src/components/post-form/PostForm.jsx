import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || 'draft',
      image: null,
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(post?.featuredImage || null);

  const DEFAULT_PLACEHOLDER_IMAGE = null; // Replace with placeholder ID if needed

  // Auto-generate slug from title
  const slugTransform = useCallback(
    (value) => value.trim().replace(/\s+/g, '-').toLowerCase(),
    []
  );

  // Watch title changes to update slug
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') setValue('slug', slugTransform(value.title), { shouldValidate: true });
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // Fetch image preview from Appwrite
  useEffect(() => {
    const fetchImage = async () => {
      if (post?.featuredImage) {
        try {
          const url = await appwriteService.getFilePreview(post.featuredImage);
          setImageUrl(url);
        } catch (err) {
          console.error('Error fetching image preview:', err);
          setImageUrl(DEFAULT_PLACEHOLDER_IMAGE);
        }
      } else if (preview) {
        setImageUrl(preview);
      } else {
        setImageUrl(DEFAULT_PLACEHOLDER_IMAGE);
      }
    };
    fetchImage();
  }, [post?.featuredImage, preview]);

  // Handle form submission
  const submit = async (data) => {
    try {
      setLoading(true);
      let fileId;

      // Upload new image if selected
      if (data.image?.[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        fileId = file.$id;

        // Delete old image if editing
        if (post?.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }
      } else {
        fileId = post?.featuredImage || DEFAULT_PLACEHOLDER_IMAGE;
      }

      const postData = {
        title: data.title,
        slug: data.slug || slugTransform(data.title),
        content: data.content,
        status: data.status,
        userid: userData.$id, // ensure matches backend field
        featuredImage: fileId,
      };

      let dbPost;
      if (post) {
        dbPost = await appwriteService.updatePost(post.$id, postData);
      } else {
        dbPost = await appwriteService.createPost(postData);
      }

      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } catch (err) {
      console.error('❌ Post submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-blue-50 shadow-xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {post ? 'Edit Your Post' : 'Create a New Post'}
      </h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Title</label>
          <Input type="text" placeholder="Enter post title" {...register('title', { required: true })} />
        </div>

        {/* Slug */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Slug</label>
          <Input type="text" placeholder="post-title-slug" {...register('slug', { required: true })} />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Content</label>
          <Controller name="content" control={control} render={({ field }) => <RTE {...field} />} />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { label: 'Draft', value: 'draft' },
                  { label: 'Published', value: 'published' },
                ]}
              />
            )}
          />
        </div>

        {/* Featured Image */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">Featured Image</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  field.onChange(e);
                  if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
            )}
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Featured Preview"
              className="mt-4 rounded-2xl shadow-md max-h-60 object-cover border border-gray-200"
            />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-2xl shadow-lg transform transition-all ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {loading ? 'Submitting...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};

export default PostForm;
