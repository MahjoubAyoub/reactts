"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/api-middleware"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Template {
  id: string
  name: string
  category: string
  dimensions: {
    width: number
    height: number
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/templates`)
        if (!response.ok) {
          throw new Error('Failed to fetch templates')
        }
        const data = await response.json()
        setTemplates(data)
      } catch (err) {
        setError("Failed to fetch templates.")
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === activeCategory)

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="Social Media">Social Media</TabsTrigger>
          <TabsTrigger value="Print">Print</TabsTrigger>
          <TabsTrigger value="Presentation">Presentation</TabsTrigger>
          <TabsTrigger value="Resume">Resume</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="group relative">
                <Link href={`/editor/template/${template.id}`}>
                  <div className="aspect-[3/4] rounded-lg border bg-muted overflow-hidden">
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4">
                      <span className="text-lg font-medium mb-2">{template.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {template.dimensions.width} x {template.dimensions.height}px
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium group-hover:underline">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
