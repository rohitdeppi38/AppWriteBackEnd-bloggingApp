import React from 'react'
import { useDispatch } from 'react-redux'
import {logOut} from "../../store/authslice"

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const logoutHandler = ()=>{
    authService.logOut().then(()=>{dispatch(logOut())})
  }
  return (
    <div className='inline-block px-6 py-2 duration-200 hover:bg-blue-199 rounded-full'>LogoutBtn</div>
  )
} 

export default LogoutBtn