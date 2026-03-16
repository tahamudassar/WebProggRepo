'use client'

import { BookAIcon, HomeIcon, HouseIcon } from 'lucide-react';
import React, { useState } from 'react'

function Sidebar() {

    const [isExpanded, setIsExpanded] = useState(false);

const communities = ['Study', 'Carpool', 'Blood donation'];
  return (
    <div className='min-h-screen bg-[#0E1113] text-white border-r border-gray-500 p-6'>
        <div className="flex flex-col">
        {/* Top Section */}
        <div className='flex flex-col space-y-4'>
            <div className='flex items-center space-x-2'>
                <HouseIcon />
                <h2 className="text-sm font-semibold">Home</h2>
            </div>
            <div className='flex items-center space-x-2'>
                <BookAIcon />
                <h2 className="text-sm font-semibold">Material</h2>
            </div>
          
          
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 w-full my-6"></div>

        {/* Bottom Section */}
        <div>
          <button
            className="w-full flex space-x-2 justify-between items-center text-lg font-semibold focus:outline-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className='text-sm'>Communities</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expandable List */}
          {isExpanded && (
            <ul className="mt-2 space-y-2 pl-4 flex flex-col">
              {communities.map((community, index) => (
                <li key={index} className="  text-[13px]   py-3">
                  {community}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar