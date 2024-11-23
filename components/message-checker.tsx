'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { MessageCheckResult, MessageCheckError } from '@/components/types'
import { WarningMessage } from '@/components/warning-message'

export function MessageChecker() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<MessageCheckResult>(null)
  const [error, setError] = useState<MessageCheckError | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkMessage = async () => {
    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/check-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      setResult(data)
    } catch (err) {
      setError({ message: 'Failed to check message', code: 'CHECK_FAILED' })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Verificador de Mensajes</CardTitle>
        <CardDescription>
          Pega el mensaje que quieres verificar y analizaremos su seguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Pega aquí el mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {result && !result.isSafe && result.explanation && (
          <WarningMessage result={result} />
        )}
        {result?.isSafe && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle />
            <span>El mensaje parece seguro</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle />
            <span>{error.message}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkMessage} 
          disabled={isChecking || !message.trim()}
          className="w-full"
        >
          {isChecking && <Loader2 className="animate-spin" />}
          {isChecking ? 'Verificando...' : 'Verificar Mensaje'}
        </Button>
      </CardFooter>
    </Card>
  )
}

