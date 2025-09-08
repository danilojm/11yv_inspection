
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

    // Generate HTML content for PDF
    const generalSafetyData = (inspection.generalSafety as any[]) || []
    const fireSafetyData = (inspection.fireSafety as any[]) || []

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Workplace Safety Inspection Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2563eb; margin-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 30px; }
            .info-item { margin-bottom: 8px; }
            .info-label { font-weight: bold; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 5px; }
            .fire-section h2 { color: #dc2626; border-bottom: 2px solid #dc2626; }
            .checklist-item { margin-bottom: 15px; padding: 10px; border: 1px solid #e5e7eb; border-radius: 5px; }
            .item-number { background: #2563eb; color: white; border-radius: 50%; width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px; }
            .fire-item .item-number { background: #dc2626; }
            .response { margin: 8px 0; }
            .response.yes { color: #059669; font-weight: bold; }
            .response.no { color: #dc2626; font-weight: bold; }
            .response.na { color: #6b7280; font-weight: bold; }
            .comments { margin-top: 8px; font-style: italic; color: #4b5563; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Workplace Safety Inspection Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Completed by:</span> ${inspection.completedBy}
            </div>
            <div class="info-item">
              <span class="info-label">Building:</span> ${inspection.building}
            </div>
            <div class="info-item">
              <span class="info-label">Supervisor:</span> ${inspection.supervisor}
            </div>
            <div class="info-item">
              <span class="info-label">Department:</span> ${inspection.department}
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span> ${new Date(inspection.date).toLocaleDateString()}
            </div>
            <div class="info-item">
              <span class="info-label">Room:</span> ${inspection.room}
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span> ${inspection.phone}
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span> ${inspection.isCompleted ? 'Completed' : 'Draft'}
            </div>
          </div>

          <div class="section">
            <h2>General Safety</h2>
            ${GENERAL_SAFETY_ITEMS.map((item, index) => {
              const itemData = generalSafetyData.find(gs => gs?.itemNumber === index + 1)
              const response = itemData?.response || 'Not answered'
              const comments = itemData?.comments || ''
              
              return `
                <div class="checklist-item">
                  <div style="display: flex; align-items: flex-start;">
                    <span class="item-number">${index + 1}</span>
                    <div style="flex: 1;">
                      <div>${item}</div>
                      <div class="response ${response.toLowerCase()}">${response.toUpperCase()}</div>
                      ${comments ? `<div class="comments">Comments: ${comments}</div>` : ''}
                    </div>
                  </div>
                </div>
              `
            }).join('')}
          </div>

          <div class="section">
            <h2 class="fire-section">Fire Safety</h2>
            ${FIRE_SAFETY_ITEMS.map((item, index) => {
              const itemData = fireSafetyData.find(fs => fs?.itemNumber === index + 1)
              const response = itemData?.response || 'Not answered'
              const comments = itemData?.comments || ''
              
              return `
                <div class="checklist-item fire-item">
                  <div style="display: flex; align-items: flex-start;">
                    <span class="item-number">${index + 1}</span>
                    <div style="flex: 1;">
                      <div>${item}</div>
                      <div class="response ${response.toLowerCase()}">${response.toUpperCase()}</div>
                      ${comments ? `<div class="comments">Comments: ${comments}</div>` : ''}
                    </div>
                  </div>
                </div>
              `
            }).join('')}
          </div>

          <div class="footer">
            <p><strong>Note:</strong> This form is specifically designed for laboratory safety inspections and includes requirements unique to laboratory environments.</p>
            <p>Report generated from Workplace Safety Inspection System</p>
          </div>
        </body>
      </html>
    `

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="safety_inspection_${id}.html"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
