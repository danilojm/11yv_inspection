
"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GENERAL_SAFETY_ITEMS, FIRE_SAFETY_ITEMS } from "@/lib/constants"
import type { InspectionData, HeaderInfo, ChecklistItem, ResponseOption } from "@/lib/types"
import { FileCheck2, Save, Download, Share2, AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { format } from "date-fns"

interface InspectionFormProps {
  onSubmit: (data: InspectionData, isDraft: boolean) => Promise<void>
  initialData?: Partial<InspectionData>
}

export function InspectionForm({ onSubmit, initialData }: InspectionFormProps) {
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>(() => ({
    completedBy: initialData?.headerInfo?.completedBy || "",
    building: initialData?.headerInfo?.building || "",
    supervisor: initialData?.headerInfo?.supervisor || "",
    department: initialData?.headerInfo?.department || "",
    date: initialData?.headerInfo?.date || format(new Date(), "yyyy-MM-dd"),
    room: initialData?.headerInfo?.room || "",
    phone: initialData?.headerInfo?.phone || "",
  }))

  const [generalSafety, setGeneralSafety] = useState<ChecklistItem[]>(() =>
    GENERAL_SAFETY_ITEMS.map((_, index) => {
      const existing = initialData?.generalSafety?.find(item => item?.itemNumber === index + 1)
      return {
        itemNumber: index + 1,
        response: existing?.response,
        comments: existing?.comments || "",
      }
    })
  )

  const [fireSafety, setFireSafety] = useState<ChecklistItem[]>(() =>
    FIRE_SAFETY_ITEMS.map((_, index) => {
      const existing = initialData?.fireSafety?.find(item => item?.itemNumber === index + 1)
      return {
        itemNumber: index + 1,
        response: existing?.response,
        comments: existing?.comments || "",
      }
    })
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateHeaderInfo = useCallback((field: keyof HeaderInfo, value: string) => {
    setHeaderInfo(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateGeneralSafety = useCallback((itemNumber: number, field: keyof ChecklistItem, value: string) => {
    setGeneralSafety(prev =>
      prev?.map(item =>
        item?.itemNumber === itemNumber
          ? { ...item, [field]: value }
          : item
      ) || []
    )
  }, [])

  const updateFireSafety = useCallback((itemNumber: number, field: keyof ChecklistItem, value: string) => {
    setFireSafety(prev =>
      prev?.map(item =>
        item?.itemNumber === itemNumber
          ? { ...item, [field]: value }
          : item
      ) || []
    )
  }, [])

  const handleSubmit = async (isDraft: boolean) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const data: InspectionData = {
        headerInfo,
        generalSafety,
        fireSafety,
        isCompleted: !isDraft,
        isDraft,
      }
      await onSubmit(data, isDraft)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getResponseIcon = (response?: ResponseOption) => {
    switch (response) {
      case 'yes':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'no':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'na':
        return <HelpCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const isFormValid = () => {
    const requiredFields = [
      headerInfo?.completedBy,
      headerInfo?.building,
      headerInfo?.supervisor,
      headerInfo?.department,
      headerInfo?.date,
      headerInfo?.room,
      headerInfo?.phone
    ]
    return requiredFields?.every(field => field?.trim() !== "")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header Information */}
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-blue-600" />
            Workplace Safety Inspection Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="completedBy">Completed by</Label>
              <Input
                id="completedBy"
                value={headerInfo?.completedBy || ""}
                onChange={(e) => updateHeaderInfo("completedBy", e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="building">Building</Label>
              <Input
                id="building"
                value={headerInfo?.building || ""}
                onChange={(e) => updateHeaderInfo("building", e.target.value)}
                placeholder="Enter building name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={headerInfo?.supervisor || ""}
                onChange={(e) => updateHeaderInfo("supervisor", e.target.value)}
                placeholder="Enter supervisor name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={headerInfo?.department || ""}
                onChange={(e) => updateHeaderInfo("department", e.target.value)}
                placeholder="Enter department"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={headerInfo?.date || ""}
                onChange={(e) => updateHeaderInfo("date", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={headerInfo?.room || ""}
                onChange={(e) => updateHeaderInfo("room", e.target.value)}
                placeholder="Enter room number/name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={headerInfo?.phone || ""}
                onChange={(e) => updateHeaderInfo("phone", e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Safety Section */}
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="text-green-800">General Safety</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {GENERAL_SAFETY_ITEMS?.map((item, index) => {
              const itemData = generalSafety?.find(gs => gs?.itemNumber === index + 1)
              return (
                <div key={index + 1} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item}</p>
                    </div>
                    {getResponseIcon(itemData?.response)}
                  </div>
                  
                  <div className="ml-11">
                    <RadioGroup
                      value={itemData?.response || ""}
                      onValueChange={(value: ResponseOption) =>
                        updateGeneralSafety(index + 1, "response", value)
                      }
                      className="flex gap-6 mb-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`gs-${index}-yes`} />
                        <Label htmlFor={`gs-${index}-yes`} className="text-sm font-medium text-green-700">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`gs-${index}-no`} />
                        <Label htmlFor={`gs-${index}-no`} className="text-sm font-medium text-red-700">
                          No
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="na" id={`gs-${index}-na`} />
                        <Label htmlFor={`gs-${index}-na`} className="text-sm font-medium text-gray-600">
                          N/A
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <Textarea
                      placeholder="Comments (optional)"
                      value={itemData?.comments || ""}
                      onChange={(e) => updateGeneralSafety(index + 1, "comments", e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fire Safety Section */}
      <Card>
        <CardHeader className="bg-red-50 border-b">
          <CardTitle className="text-red-800">Fire Safety</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {FIRE_SAFETY_ITEMS?.map((item, index) => {
              const itemData = fireSafety?.find(fs => fs?.itemNumber === index + 1)
              return (
                <div key={index + 1} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item}</p>
                    </div>
                    {getResponseIcon(itemData?.response)}
                  </div>
                  
                  <div className="ml-11">
                    <RadioGroup
                      value={itemData?.response || ""}
                      onValueChange={(value: ResponseOption) =>
                        updateFireSafety(index + 1, "response", value)
                      }
                      className="flex gap-6 mb-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`fs-${index}-yes`} />
                        <Label htmlFor={`fs-${index}-yes`} className="text-sm font-medium text-green-700">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`fs-${index}-no`} />
                        <Label htmlFor={`fs-${index}-no`} className="text-sm font-medium text-red-700">
                          No
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="na" id={`fs-${index}-na`} />
                        <Label htmlFor={`fs-${index}-na`} className="text-sm font-medium text-gray-600">
                          N/A
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <Textarea
                      placeholder="Comments (optional)"
                      value={itemData?.comments || ""}
                      onChange={(e) => updateFireSafety(index + 1, "comments", e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Laboratory Note */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800 font-medium">
            <strong>Note:</strong> This form is specifically designed for laboratory safety inspections and includes requirements unique to laboratory environments. Additional safety protocols may apply.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <Button
          onClick={() => handleSubmit(true)}
          variant="outline"
          disabled={isSubmitting || !isFormValid()}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
        
        <Button
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting || !isFormValid()}
          className="flex items-center gap-2"
        >
          <FileCheck2 className="h-4 w-4" />
          Complete Inspection
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            if (navigator?.share) {
              navigator.share({
                title: 'Workplace Safety Inspection',
                text: 'Safety inspection checklist',
                url: window?.location?.href
              }).catch(console.error)
            }
          }}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
