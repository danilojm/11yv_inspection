
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Workplace Safety Inspection System",
  description: "Comprehensive workplace safety inspection checklist and reporting system",
  keywords: "safety, inspection, workplace, checklist, compliance, fire safety, general safety",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        {children}
      </body>
    </html>
  )
}
