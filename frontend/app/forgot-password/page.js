'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [isCooldown, setIsCooldown] = useState(false) // Timer state
  const [timeLeft, setTimeLeft] = useState(0) // Countdown timer state
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/passwordReset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.detail) // Show success message
        setIsCooldown(true) // Start cooldown
        setTimeLeft(60) // Set the countdown timer to 60 seconds
      } else {
        const errorData = await response.json()
        setError(errorData.detail) // Show error message
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setError('Something went wrong. Please try again.')
    }
  }

  // Manage the countdown timer
  useEffect(() => {
    if (isCooldown && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer) // Cleanup on unmount
    } else if (timeLeft === 0) {
      setIsCooldown(false)
    }
  }, [isCooldown, timeLeft])

  return (
    <div className='flex items-center justify-between gap-10'>
      <Card className="space-y-6 mt-20 overflow-hidden w-1/2 p-5">
        <h2 className="text-white text-3xl font-bold text-center">
          Forgot Your Password?
        </h2>
        <p className="text-gray-400 text-sm text-center">
          Enter your email address below, and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
            />
          </div>
          {message && (
            <p className="text-green-500 text-sm mt-2">{message}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <Button
            type="submit"
            className="float-right w-full mt-4"
            disabled={isCooldown} // Disable button during cooldown
          >
            {isCooldown ? `Resend in ${timeLeft}s` : 'Send Reset Link'}
          </Button>
        </form>
        <button
          type="button"
          className="text-sm text-blue-500 hover:underline mt-4"
          onClick={() => router.push('/login')}
        >
          Back to Login
        </button>
      </Card>
      <div className='w-full h-screen '>
      </div>
    </div>
  )
}

export default ForgotPassword
