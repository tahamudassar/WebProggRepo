import React from "react";
import { BellIcon, SearchIcon } from "lucide-react";
import Image from "next/image";


function Header() {
  return (
    <div className="flex items-center justify-between  bg-[#0E1113] text-white p-2 border-b-1 border-gray-700">
      {/* logo and name */}
      <div className="flex items-center space-x-2">
        <Image width={38} height={38} src='/logo.png' />
        <h1 className=" text-lg">FASTLink</h1>
      </div>

      {/* searchbar */}
      <div className=" w-2/4 flex items-center bg-[#576970] space-x-2 rounded-md p-1   md:mr-56">
       <SearchIcon className="w-4 h-4" />
       <input placeholder="Search FASTLink" className="w-full bg-[#576970] focus:outline-none text-sm"/>
      </div>

      {/* icons */}
      <button className="px-2 cursor-pointer  hover:opacity-50">Login</button>
    </div>
  );
}

export default Header;
