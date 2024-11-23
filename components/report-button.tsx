'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

interface ReportButtonProps {
  message: string;
}

export function ReportButton({ message }: ReportButtonProps) {
  const [isReporting, setIsReporting] = useState(false)

  const reportMessage = async () => {
    setIsReporting(true)
    try {
      alert('¡Gracias por reportar este mensaje! Ayudas a mantener segura nuestra comunidad.')
    } catch (error) {
      console.error('Error reporting message:', error)
      alert('No se pudo reportar el mensaje. Por favor intenta nuevamente.')
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400"
      onClick={reportMessage}
      disabled={isReporting}
    >
      <AlertTriangle className="w-4 h-4 mr-2" />
      {isReporting ? 'Reportando...' : 'Reportar Mensaje'}
    </Button>
  )
}
