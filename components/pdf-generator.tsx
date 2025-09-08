
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet } from "lucide-react"

interface PDFGeneratorProps {
  inspectionId: string
}

export function PDFGenerator({ inspectionId }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadPDF = async () => {
    if (!inspectionId) return
    
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/export/pdf?id=${inspectionId}`)
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `safety_inspection_${inspectionId}.html`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF report')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCSV = async () => {
    if (!inspectionId) return
    
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/export/sheets?id=${inspectionId}`)
      if (!response.ok) throw new Error('Failed to generate CSV')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `safety_inspection_${inspectionId}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('Failed to download CSV for Google Sheets')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={downloadPDF}
        disabled={isGenerating}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Report
      </Button>
      
      <Button
        onClick={downloadCSV}
        disabled={isGenerating}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export to Sheets
      </Button>
    </div>
  )
}
