import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

const PostCard = ({ $id, title, featuredImage }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      if (featuredImage) {
        const url = await appwriteService.getFilePreview(featuredImage);
        setImageUrl(url);
      }
    };
    fetchImage();
  }, [featuredImage]);

  return (
    <Link to={`post/${$id}`}>
      <div className='full bg-gray-200 rounded-xl p-4'>
        {imageUrl && (
          <div className='w-full justify-center mb-4'>
            <img src={imageUrl} alt={title} className='rounded-xl' />
          </div>
        )}
        <h2 className='text-xl font-bold'>{title}</h2>
      </div>
    </Link>
  );
};

export default PostCard;
