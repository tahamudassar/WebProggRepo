'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/store'

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    })
    const router = useRouter()
    const setUser = useUserData((state)=>state.setUser)  

    const handleChange = (e)=>{
      const {name, value} = e.target
      setFormData({
        ...formData,
        [name]: value,
      })
    }


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          console.log('login successful');
          const data = await response.json()
          console.log(data)
          //save user data in the store
          setUser({
            username: data.username,
            email: data.email
          })



          router.push("/")

          
        } else {

          console.error('Loginup failed');
          // Handle failure
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

  return (
    <div className=' min-h-screen flex items-center justify-center  pb-14 overflow-y-scroll no-scrollbar'>
        <div className="bg-[#242623] rounded-lg shadow-lg p-8 border-2  w-1/2">
          <h2 className="text-white text-3xl font-bold text-center">Welcome Back</h2>
          <form className="space-y-6 mt-6">
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder="mazharhussain@gmail.com"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
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
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
        </div>
    </div>
  )
}

export default Login