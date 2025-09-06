import React from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from "../../store/authslice";
import authService from "../../appwrite/auth"; // make sure this path is correct

const LogoutBtn = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logOut());
    }).catch((err) => {
      console.error("Logout failed:", err);
    });
  };

  return (
    <div
      onClick={logoutHandler}
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-500 rounded-full cursor-pointer text-white bg-blue-600"
    >
      Logout
    </div>
  );
};

export default LogoutBtn;
