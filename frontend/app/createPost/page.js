'use client'

import { ArrowRightCircle, BookMarked, Car } from 'lucide-react'
import { MdOutlineBloodtype } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import { button } from '@nextui-org/theme';

function PostType() {
    const [community, setCommunity] = useState('')
    console.log(community)

    useEffect(()=>{

    }, [community])


    const handleClick = (e)=>{
        e.preventDefault()
        setCommunity(e.currentTarget.name)
    }

  return (
    <div className='min-h-screen flex justify-center items-center w-full  flex-col space-y-20 text-white'>
        <h2 className=' text-3xl pr-16'>Select Community</h2>

        <div className='flex items-center  justify-around w-full'>
            <button onClick={handleClick} name='study' className={`border p-2 rounded-lg flex items-center space-x-1  hover:bg-green-300 cursor-pointer ${community && community == 'study' ? 'bg-green-300' : ''}`}>
                <BookMarked className='h-4 w-4' />
                <span className='text-xl'>Study</span>
            </button>

            <button onClick={handleClick} name='carpool' className={`border p-2 rounded-lg flex items-center space-x-1 hover:bg-green-300 cursor-pointer ${community == 'carpool' ? 'bg-green-300' : ''}`}>
                <Car className='h-5 w-5' />
                <span className='text-xl'>Carpool</span>
            </button>

            <button onClick={handleClick} name='blood' className={`border p-2 rounded-lg flex items-center space-x-1 hover:bg-green-300 cursor-pointer ${community == 'blood' ? 'bg-green-300' : ''}`}>
                <MdOutlineBloodtype />
                <span className='text-xl'>Blood Donation</span>
            </button>
        </div>


    
            <div className={`flex items-center pr-20 space-x-1 ${!community && ' invisible'}  cursor-pointer`}>
                <button className={`text-lg `}>Continue</button>
                <ArrowRightCircle />
            </div>
            
            
        
    </div>
  )
}

export default PostType