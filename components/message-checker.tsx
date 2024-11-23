'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { MessageCheckResult, MessageCheckError } from '@/components/types'
import { WarningMessage } from '@/components/warning-message'
import { ImageUpload } from '@/components/image-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MessageChecker() {
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<MessageCheckResult>(null)
  const [error, setError] = useState<MessageCheckError | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
    setResult(null)
    setError(null)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setResult(null)
    setError(null)
  }

  const handleTabChange = () => {
    setMessage('')
    setSelectedImage(null)
    setSelectedFile(null)
    setResult(null)
    setError(null)
  }

  const checkContent = async () => {
    setIsChecking(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    if (selectedFile) {
      formData.append('image', selectedFile)
    }
    if (message) {
      formData.append('message', message)
    }

    try {
      const response = await fetch('/api/check-message', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      setResult(data)
    } catch (err) {
      setError({ message: 'Error al verificar el contenido', code: 'CHECK_FAILED' })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Verificador de Contenido</CardTitle>
        <CardDescription>
          Ingresa un mensaje o sube una imagen para verificar su seguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text" className="w-full max-w-2xl" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Texto</TabsTrigger>
            <TabsTrigger value="image">Imagen</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <Textarea
              placeholder="Pega aquí el mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="image">
            <ImageUpload
              onImageSelect={handleImageSelect}
              onClear={clearImage}
              selectedImage={selectedImage}
            />
          </TabsContent>
        </Tabs>

        {result && !result.isSafe && result.explanation && (
          <WarningMessage result={result} />
        )}
        {result?.isSafe && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle />
            <span>El contenido parece seguro</span>
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
          onClick={checkContent} 
          disabled={isChecking || (!message && !selectedImage)}
          className="w-full"
        >
          {isChecking && <Loader2 className="animate-spin" />}
          {isChecking ? 'Verificando...' : 'Verificar Contenido'}
        </Button>
      </CardFooter>
    </Card>
  )
}

