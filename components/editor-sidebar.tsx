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

interface EditorSidebarProps {
  onAddElement: (type: string, props?: any) => void
  onUploadImage?: (file: File) => void
}

export function EditorSidebar({ onAddElement, onUploadImage }: EditorSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && onUploadImage) {
      onUploadImage(files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Filter elements based on search term
  const filterElements = (elements: { name: string; icon: any; type: string; props?: any }[]) => {
    if (!searchTerm) return elements
    return elements.filter((element) => element.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // Basic shapes
  const shapes = [
    { name: "Rectangle", icon: Square, type: "rect" },
    { name: "Circle", icon: Circle, type: "ellipse" },
    { name: "Triangle", icon: Triangle, type: "regularPolygon", props: { sides: 3 } },
    { name: "Hexagon", icon: Hexagon, type: "regularPolygon", props: { sides: 6 } },
    { name: "Star", icon: Star, type: "star", props: { numPoints: 5, innerRadius: 20, outerRadius: 50 } },
    {
      name: "Heart",
      icon: Heart,
      type: "path",
      props: {
        data: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      },
    },
  ]

  // Text styles
  const textStyles = [
    { name: "Heading", icon: Type, type: "text", props: { text: "Heading", fontSize: 32, fontStyle: "bold" } },
    { name: "Subheading", icon: Type, type: "text", props: { text: "Subheading", fontSize: 24 } },
    { name: "Body Text", icon: Type, type: "text", props: { text: "Body Text", fontSize: 16 } },
    { name: "Caption", icon: Type, type: "text", props: { text: "Caption", fontSize: 12 } },
  ]

  // Icons and elements
  const icons = [
    { name: "Check", icon: Check, type: "icon", props: { data: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" } },
    {
      name: "X",
      icon: X,
      type: "icon",
      props: {
        data: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
      },
    },
    {
      name: "Arrow",
      icon: ArrowRight,
      type: "icon",
      props: { data: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" },
    },
    {
      name: "Message",
      icon: MessageCircle,
      type: "icon",
      props: {
        data: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
      },
    },
    {
      name: "Smile",
      icon: Smile,
      type: "icon",
      props: {
        data: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-5 7h10v2H7v-2zm1.732-3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6.536 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z",
      },
    },
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
                  <h3 className="text-sm font-medium">Basic Elements</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-20 flex-col gap-1"
                      onClick={() => onAddElement("text")}
                    >
                      <Type className="h-5 w-5" />
                      <span>Text</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-20 flex-col gap-1"
                      onClick={() => onAddElement("rect")}
                    >
                      <Square className="h-5 w-5" />
                      <span>Shape</span>
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
                    <Button variant="outline" size="sm" className="h-20 flex-col gap-1">
                      <Layers className="h-5 w-5" />
                      <span>Layer</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-20 flex-col gap-1">
                      <Grid3X3 className="h-5 w-5" />
                      <span>Grid</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-20 flex-col gap-1">
                      <PenTool className="h-5 w-5" />
                      <span>Draw</span>
                    </Button>
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

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Icons</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {filterElements(icons).map((icon, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-12 p-0 flex flex-col items-center justify-center gap-1"
                        onClick={() => onAddElement(icon.type, icon.props)}
                        title={icon.name}
                      >
                        <icon.icon className="h-5 w-5" />
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
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">Upload Images</h3>
                  <p className="text-xs text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm" onClick={triggerFileInput}>
                    Choose File
                  </Button>
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

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Presentations</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] bg-muted rounded-md cursor-pointer hover:bg-muted/80 flex items-center justify-center"
                      >
                        <span className="text-xs text-muted-foreground">Slide {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Print</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] bg-muted rounded-md cursor-pointer hover:bg-muted/80 flex items-center justify-center"
                      >
                        <span className="text-xs text-muted-foreground">Print {i + 1}</span>
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
