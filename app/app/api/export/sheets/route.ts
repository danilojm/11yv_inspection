
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { GENERAL_SAFETY_ITEMS, FIRE_SAFETY_ITEMS } from '@/lib/constants'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Inspection ID is required' },
        { status: 400 }
      )
    }

    const inspection = await prisma.inspection.findUnique({
      where: { id },
    })

    if (!inspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      )
    }

    // Generate CSV content for Google Sheets
    const generalSafetyData = (inspection.generalSafety as any[]) || []
    const fireSafetyData = (inspection.fireSafety as any[]) || []

    const csvContent = [
      // Header information
      ['Workplace Safety Inspection Export'],
      [''],
      ['Header Information'],
      ['Completed by', inspection.completedBy],
      ['Building', inspection.building],
      ['Supervisor', inspection.supervisor],
      ['Department', inspection.department],
      ['Date', new Date(inspection.date).toLocaleDateString()],
      ['Room', inspection.room],
      ['Phone', inspection.phone],
      ['Status', inspection.isCompleted ? 'Completed' : 'Draft'],
      [''],
      
      // General Safety section
      ['General Safety'],
      ['Item #', 'Description', 'Response', 'Comments'],
      ...GENERAL_SAFETY_ITEMS.map((item, index) => {
        const itemData = generalSafetyData.find(gs => gs?.itemNumber === index + 1)
        return [
          (index + 1).toString(),
          item,
          itemData?.response?.toUpperCase() || 'Not answered',
          itemData?.comments || ''
        ]
      }),
      [''],
      
      // Fire Safety section
      ['Fire Safety'],
      ['Item #', 'Description', 'Response', 'Comments'],
      ...FIRE_SAFETY_ITEMS.map((item, index) => {
        const itemData = fireSafetyData.find(fs => fs?.itemNumber === index + 1)
        return [
          (index + 1).toString(),
          item,
          itemData?.response?.toUpperCase() || 'Not answered',
          itemData?.comments || ''
        ]
      })
    ]

    // Convert to CSV format
    const csvString = csvContent
      .map(row => 
        row.map(cell => 
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
      .join('\n')

    return new NextResponse(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="safety_inspection_${id}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    )
  }
}
