"use client";
import React, { useEffect, useState } from "react";
import { BellIcon, Plus, PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUserData } from "@/store";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileButton from "./ProfileButton";

function Header() {
  const user = useUserData((state) => state.user);
  const clearUser = useUserData((state) => state.clearUser);
  const router = useRouter();

  useEffect(() => {
    console.log(user);
  }, [user]);

  // const handleLogout = (e) => {
  //   e.preventDefault();
  //   clearUser();
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   router.push("/login");
  // };

  const handleCreatePost = (e) => {
    e.preventDefault();
    router.push("/createPost");
  };

  return (
    <div className="w-full fixed top-0 left-0 px-3 py-2 bg-main-color flex items-center justify-between z-50 border-gray-700/50 border-b-[1px]">
      {/* logo and name */}
      <div className="flex items-center space-x-2 w-[15rem]">
        <Image
          alt="logo"
          width={38}
          height={38}
          src="/logo.png"
          className="w-auto h-auto"
        />
        <Link href="/" className=" text-lg">
          FASTLink
        </Link>
      </div>

      {/* searchbar */}
      {/* <div className="w-full flex items-center justify-center">
        <div className=" w-2/4 flex items-center bg-[#576970] space-x-2 rounded-md p-1 md:mr-56 ">
          <SearchIcon className="w-4 h-4" />
          <input
            placeholder="Search FASTLink"
            className="w-full bg-[#576970] focus:outline-none text-sm"
          />
        </div>
      </div> */}

      {/* icons */}

      {user.username ? (
        <div className="flex items-center justify-end space-x-2 text-sm  w-[15rem]">
          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-1"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create</span>
          </button>
          {/* <button
            onClick={handleLogout}
            className="px-2 cursor-pointer  hover:opacity-50"
          >
            Logout
          </button> */}
          {/* <Button >Secondary</Button> */}
          {/* <Button variant="secondary">{user.username}</Button> */}
          <ProfileButton />
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-sm">
          <Button>
            <Link
              href="/login"
              // className="px-2 cursor-pointer  hover:opacity-50"
            >
              Login
            </Link>
          </Button>

          <Link
            href="/signup"
            className="px-2 cursor-pointer  hover:opacity-50 border p-1 rounded-md text-green-200"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
