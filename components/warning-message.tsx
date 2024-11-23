import { Copy } from 'lucide-react'
import { Button } from './ui/button'
import { MessageCheckResult } from './types'

interface WarningMessageProps {
  result: NonNullable<MessageCheckResult>;
  phoneNumber?: string;
}

export function WarningMessage({ result, phoneNumber = "133" }: WarningMessageProps) {
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(phoneNumber)
  }

  return (
    <div className="space-y-4 text-red-500 dark:text-red-400">
      <h3 className="font-bold text-lg">Advertencia: Mensaje Potencialmente Peligroso</h3>
      
      <p className="text-sm">{result.explanation}</p>

      <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold">Consejos de Seguridad:</h4>
        <ul className="text-sm list-disc list-inside space-y-1">
          {(result.safetyTips ?? []).map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold">Pasos Recomendados:</h4>
        <ul className="text-sm list-disc list-inside space-y-1">
          {(result.recommendedActions ?? []).map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>

      <div className="pt-2">
        <h4 className="font-semibold">¿Necesitas Ayuda?</h4>
        <p className="text-sm">
          Llama a Carabineros: <span className="font-bold">{phoneNumber}</span>
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={copyPhoneNumber}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copiar Número
        </Button>
      </div>
    </div>
  )
}