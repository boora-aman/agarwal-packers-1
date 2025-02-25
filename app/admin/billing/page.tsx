"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileSpreadsheet, FileCheck, Receipt } from "lucide-react"

export default function BillingPage() {
  const router = useRouter()

  const documents = [
    {
      title: "Quotation",
      description: "Create and manage quotations for customers",
      icon: FileText,
      href: "/admin/billing/quotations",
    },
    {
      title: "Bill",
      description: "Generate and track customer bills",
      icon: FileSpreadsheet,
      href: "/admin/billing/bills",
    },
    {
      title: "LR",
      description: "Manage Lorry/Bilty Receipts",
      icon: FileCheck,
      href: "/admin/billing/bilty",
    },
    {
      title: "Money Receipt",
      description: "Track payment receipts",
      icon: Receipt,
      href: "/admin/billing/receipts",
    },
  ]

  return (

    <div className="container mx-auto px-4 pt-24 pb-8">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <h1 className="text-3xl font-bold">Billing Management</h1>
      <Button 
        onClick={() => router.push("/admin/dashboard")}
        className="w-full sm:w-auto"
      >
        Back to Dashboard
      </Button>
    </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <Card
            key={doc.title}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(doc.href)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <doc.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{doc.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{doc.description}</CardDescription>
              <Button className="w-full mt-4" variant="outline">
                View {doc.title}s
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Quick overview of your latest billing documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            Select a document type above to view and manage documents
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

