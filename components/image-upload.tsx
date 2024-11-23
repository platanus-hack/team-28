import { useState, useEffect, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onClear: () => void
  selectedImage: string | null
}

export function ImageUpload({ onImageSelect, onClear, selectedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageSelect(file)
    }
  }

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Toca para seleccionar</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Selecciona una captura de pantalla
                </p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full h-64">
            <Image
              src={selectedImage}
              alt="Selected image"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
            onClick={onClear}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}