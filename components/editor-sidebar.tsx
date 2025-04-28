"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ImageIcon,
  Square,
  Circle,
  Triangle,
  Type,
  Layers,
  Search,
  Grid3X3,
  Upload,
  Heart,
  Star,
  MessageCircle,
  ArrowRight,
  Check,
  X,
  PenTool,
  Hexagon,
  Smile,
} from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface EditorSidebarProps {
  onAddElement: (type: string, props?: any) => void
  onUploadImage?: (file: File) => void
  onToggleDrawMode?: () => void
  isDrawing?: boolean
}

export function EditorSidebar({ onAddElement, onUploadImage, onToggleDrawMode, isDrawing }: EditorSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && onUploadImage) {
      onUploadImage(files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && onUploadImage) {
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      if (imageFiles.length > 0) {
        onUploadImage(imageFiles[0])
      }
    }
  }

  // Filter elements based on search term
  const filterElements = (elements: { name: string; icon: any; type: string; props?: any }[]) => {
    if (!searchTerm) return elements
    return elements.filter((element) => element.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // Basic shapes
  const shapes = [
    { name: "Rectangle", icon: Square, type: "rect" },
    { name: "Square", icon: Square, type: "rect", props: { width: 100, height: 100 } },
    { name: "Circle", icon: Circle, type: "circle" },
    { name: "Ellipse", icon: Circle, type: "ellipse" },
    { name: "Triangle", icon: Triangle, type: "regularPolygon", props: { sides: 3 } },
    { name: "Pentagon", icon: Hexagon, type: "regularPolygon", props: { sides: 5 } },
    { name: "Hexagon", icon: Hexagon, type: "regularPolygon", props: { sides: 6 } },
    { name: "Octagon", icon: Hexagon, type: "regularPolygon", props: { sides: 8 } },
    { name: "Star-5", icon: Star, type: "star", props: { numPoints: 5, innerRadius: 20, outerRadius: 50 } },
    { name: "Star-6", icon: Star, type: "star", props: { numPoints: 6, innerRadius: 25, outerRadius: 50 } },
    { name: "Star-8", icon: Star, type: "star", props: { numPoints: 8, innerRadius: 30, outerRadius: 50 } },
  ]

  // Text styles
  const textStyles = [
    { name: "Heading", icon: Type, type: "text", props: { text: "Heading", fontSize: 32, fontStyle: "bold" } },
    { name: "Subheading", icon: Type, type: "text", props: { text: "Subheading", fontSize: 24 } },
    { name: "Body Text", icon: Type, type: "text", props: { text: "Body Text", fontSize: 16 } },
    { name: "Caption", icon: Type, type: "text", props: { text: "Caption", fontSize: 12 } },
  ]

  return (
    <div className="w-64 border-r bg-background">
      <Tabs defaultValue="elements">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="elements" className="flex-1">
            Elements
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex-1">
            Uploads
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">
            Templates
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsContent value="elements" className="mt-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Basic Tools</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-20 flex-col gap-1"
                      onClick={() => onAddElement("text", { text: "New Text" })}
                    >
                      <Type className="h-5 w-5" />
                      <span>Text</span>
                    </Button>
                    <Button
                      variant={isDrawing ? "default" : "outline"}
                      size="sm"
                      className="h-20 flex-col gap-1"
                      onClick={onToggleDrawMode}
                    >
                      <PenTool className="h-5 w-5" />
                      <span>Draw</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-20 flex-col gap-1" onClick={triggerFileInput}>
                      <ImageIcon className="h-5 w-5" />
                      <span>Image</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Text Styles</h3>
                  <div className="space-y-2">
                    {filterElements(textStyles).map((style, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onAddElement(style.type, style.props)}
                      >
                        <span
                          className={`${
                            style.props.fontSize === 32
                              ? "text-xl font-bold"
                              : style.props.fontSize === 24
                              ? "text-lg"
                              : style.props.fontSize === 12
                              ? "text-xs"
                              : "text-base"
                          }`}
                        >
                          {style.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Shapes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {filterElements(shapes).map((shape, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-12 p-0 flex flex-col items-center justify-center gap-1"
                        onClick={() => onAddElement(shape.type, shape.props)}
                        title={shape.name}
                      >
                        <shape.icon className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="uploads" className="mt-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    isDragging ? "border-primary bg-muted/50" : "border-border",
                    "relative"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">Upload Images</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {isDragging ? "Drop image here" : "Drag and drop or click to upload"}
                  </p>
                  <Button variant="outline" size="sm" onClick={triggerFileInput}>
                    Choose File
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Uploads</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-muted rounded-md cursor-pointer hover:bg-muted/80 flex items-center justify-center"
                        onClick={() => onAddElement("image", { src: `/placeholder.svg?height=100&width=100` })}
                      >
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Social Media</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-muted rounded-md cursor-pointer hover:bg-muted/80 flex items-center justify-center"
                      >
                        <span className="text-xs text-muted-foreground">Template {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
