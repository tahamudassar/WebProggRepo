'use client'
import React, { useState } from 'react'

function Signup() {
    const [showPassword, setShowPassword] = useState(false)

  return (
    <div className=' min-h-screen flex items-center justify-center  pb-14 overflow-y-scroll no-scrollbar'>
        <div className="bg-[#242623] rounded-lg shadow-lg p-8 border-2  w-1/2">
          <h2 className="text-white text-3xl font-bold text-center">SIGN UP</h2>
          <form className="space-y-6 mt-6">
            <div>
              <label className="block text-gray-300">Username</label>
              <input
                type="text"
                placeholder="MazharHussain69xx"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                placeholder="mazharhussain@gmail.com"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-400"
                  onClick={()=>{setShowPassword(!showPassword)}}
                >
                  👁️
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-green-900 py-2 rounded-md font-semibold hover:bg-gray-700 hover:text-green-300"
            >
              Create Account
            </button>
          </form>
        </div>
    </div>
  )
}

export default Signup