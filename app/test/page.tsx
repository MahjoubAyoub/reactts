"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const [apiMessage, setApiMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test')
      const data = await response.json()
      setApiMessage(data.message)
      setError('')
    } catch (err) {
      setError('Failed to connect to API')
      setApiMessage('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <Button onClick={testConnection}>
        Test API Connection
      </Button>
      {apiMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {apiMessage}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}