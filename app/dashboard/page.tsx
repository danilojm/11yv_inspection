
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PDFGenerator } from "@/components/pdf-generator"
import { Shield, FileText, Calendar, User, Building, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-static"

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const inspections = await prisma.inspection.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20, // Show recent 20 inspections
  })

  const stats = {
    total: inspections?.length || 0,
    completed: inspections?.filter(i => i?.isCompleted)?.length || 0,
    drafts: inspections?.filter(i => i?.isDraft)?.length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Safety Inspection Dashboard
              </h1>
            </div>
            <nav>
              <Button asChild>
                <Link href="/">
                  <FileText className="h-4 w-4 mr-2" />
                  New Inspection
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Inspections</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inspections List */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            {inspections?.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first safety inspection.</p>
                <Button asChild>
                  <Link href="/">Create New Inspection</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {inspections?.map((inspection) => (
                  <div
                    key={inspection?.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            inspection?.isCompleted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inspection?.isCompleted ? 'Completed' : 'Draft'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">By:</span>
                            <span className="font-medium">{inspection?.completedBy}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Building:</span>
                            <span className="font-medium">{inspection?.building}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Dept:</span>
                            <span className="font-medium">{inspection?.department}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                              {new Date(inspection?.date || '').toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {inspection?.isCompleted && (
                          <PDFGenerator inspectionId={inspection.id} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
