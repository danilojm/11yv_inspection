
"use client"

import { InspectionForm } from "@/components/inspection-form"
import type { InspectionData } from "@/lib/types"

export function InspectionFormWrapper() {
  const handleSubmit = async (data: InspectionData, isDraft: boolean) => {
    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save inspection')
      }

      const result = await response.json()
      
      // Show success message and redirect to dashboard
      alert(result.message)
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error saving inspection:', error)
      alert('Failed to save inspection. Please try again.')
    }
  }

  return <InspectionForm onSubmit={handleSubmit} />
}
