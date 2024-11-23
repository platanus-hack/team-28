'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { MessageCheckResult, MessageCheckError } from '@/components/types'

export function MessageChecker() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<MessageCheckResult>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<MessageCheckError | null>(null)

  const checkMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/check-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud')
      }

      setResult(data.isSafe ? 'safe' : 'unsafe')
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Error desconocido',
        code: 'CHECK_ERROR'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderResult = () => {
    if (isLoading) return null
    if (!result) return null

    const isMessageSafe = result === 'safe'
    const Icon = isMessageSafe ? CheckCircle : XCircle
    const message = isMessageSafe 
      ? 'Este mensaje parece ser seguro.'
      : 'Este mensaje puede ser potencialmente malicioso.'

    return (
      <div className={`flex items-center ${
        isMessageSafe ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
      }`}>
        <Icon className="mr-2" />
        <span>{message}</span>
      </div>
    )
  }

  const renderError = () => {
    if (!error) return null

    return (
      <div className="flex items-center text-red-500 dark:text-red-400">
        <AlertCircle className="mr-2" />
        <span>{error.message}</span>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        `<CardTitle>Verificador de Mensajes</CardTitle>`
        <CardDescription>
          Pega tu mensaje para verificar si es seguro o potencialmente malicioso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Pega tu mensaje aquí..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
          disabled={isLoading}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <Button 
          onClick={checkMessage} 
          className="w-full" 
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            'Verificar Mensaje'
          )}
        </Button>
        {renderResult()}
        {renderError()}
      </CardFooter>
    </Card>
  )
}

