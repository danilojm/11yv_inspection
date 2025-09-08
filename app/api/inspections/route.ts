
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type { InspectionData } from '@/lib/types'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { headerInfo, generalSafety, fireSafety, isCompleted, isDraft } = body as InspectionData

    // Validate required fields
    if (!headerInfo?.completedBy || !headerInfo?.building || !headerInfo?.supervisor || 
        !headerInfo?.department || !headerInfo?.date || !headerInfo?.room || !headerInfo?.phone) {
      return NextResponse.json(
        { error: 'All header fields are required' },
        { status: 400 }
      )
    }

    const inspection = await prisma.inspection.create({
      data: {
        completedBy: headerInfo.completedBy,
        building: headerInfo.building,
        supervisor: headerInfo.supervisor,
        department: headerInfo.department,
        date: new Date(headerInfo.date),
        room: headerInfo.room,
        phone: headerInfo.phone,
        generalSafety: (generalSafety || []) as any,
        fireSafety: (fireSafety || []) as any,
        isCompleted: isCompleted || false,
        isDraft: isDraft ?? true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      id: inspection.id,
      message: isDraft ? 'Draft saved successfully' : 'Inspection completed successfully'
    })
  } catch (error) {
    console.error('Error saving inspection:', error)
    return NextResponse.json(
      { error: 'Failed to save inspection' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get single inspection
      const inspection = await prisma.inspection.findUnique({
        where: { id },
      })

      if (!inspection) {
        return NextResponse.json(
          { error: 'Inspection not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(inspection)
    } else {
      // Get all inspections
      const inspections = await prisma.inspection.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          completedBy: true,
          building: true,
          department: true,
          date: true,
          isCompleted: true,
          isDraft: true,
          createdAt: true,
        },
      })

      return NextResponse.json(inspections)
    }
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inspections' },
      { status: 500 }
    )
  }
}
