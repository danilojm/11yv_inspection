
import { InspectionFormWrapper } from "@/components/inspection-form-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Users, Building2 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Safety Inspection System
              </h1>
            </div>
            <nav className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <FileText className="h-4 w-4 mr-2" />
                  View Inspections
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Workplace Safety Inspection
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Ensure compliance and maintain a safe working environment with our detailed safety checklist
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">General Safety</h3>
                <p className="text-sm text-gray-600">16 comprehensive safety checks for workplace conditions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Fire Safety</h3>
                <p className="text-sm text-gray-600">6 critical fire safety protocol evaluations</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Professional Reports</h3>
                <p className="text-sm text-gray-600">Generate PDF reports and export to Google Sheets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <section className="pb-12">
        <InspectionFormWrapper />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-sm text-gray-400">
            Workplace Safety Inspection System - Ensuring compliance and safety standards
          </p>
        </div>
      </footer>
    </div>
  )
}
