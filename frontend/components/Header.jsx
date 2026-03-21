'use client'
import React, { useEffect, useState } from "react";
import { BellIcon, Plus, PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUserData } from "@/store";
import { useRouter } from 'next/navigation'


function Header() {
  const user = useUserData((state)=>state.user)
  const clearUser = useUserData((state)=>state.clearUser)
  const router = useRouter()

  useEffect(()=>{
    console.log(user)
  }, [user])

  const handleLogout = (e)=>{
    e.preventDefault();
    clearUser();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login')
  }

  const handleCreatePost = (e)=>{
    e.preventDefault()
    router.push('/createPost')
  }
  

  return (
    <div className="flex items-center justify-between  bg-[#0E1113] text-white p-2 border-b-1 border-gray-700">
      {/* logo and name */}
      <div className="flex items-center space-x-2">
        <Image alt="logo" width={38} height={38} src='/logo.png' />
        <Link href='/' className=" text-lg">FASTLink</Link>
      </div>

      {/* searchbar */}
      <div className=" w-2/4 flex items-center bg-[#576970] space-x-2 rounded-md p-1   md:mr-56">
       <SearchIcon className="w-4 h-4" />
       <input placeholder="Search FASTLink" className="w-full bg-[#576970] focus:outline-none text-sm"/>
      </div>

      
      

      {/* icons */}

      {
        user.username ? (
          <div className="flex items-center space-x-2 text-sm">
        <button onClick={handleCreatePost} className="flex items-center space-x-1">
          <PlusIcon className="w-5 h-5" />
          <span>Create</span>
        </button>
        <button onClick={handleLogout} className="px-2 cursor-pointer  hover:opacity-50">Logout</button>
        <button className="px-2 cursor-pointer  hover:opacity-50 border p-1 rounded-md text-green-200">{user.username}</button>
      </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm">
        <Link href='/login' className="px-2 cursor-pointer  hover:opacity-50">Login</Link>
        <Link href='/signup' className="px-2 cursor-pointer  hover:opacity-50 border p-1 rounded-md text-green-200">Register</Link>
      </div>
        )
      }
      
    </div>
  );
}

export default Header;
