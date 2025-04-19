"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import {
  Save,
  Share2,
  Download,
  Undo,
  Redo,
  ChevronLeft,
  Facebook,
  Twitter,
  Instagram,
  LinkIcon,
  FileDown,
  Settings,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EditorHeaderProps {
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  onExport?: (format: string, quality: number) => void
  canUndo?: boolean
  canRedo?: boolean
}

export function EditorHeader({
  onUndo,
  onRedo,
  onSave,
  onExport,
  canUndo = false,
  canRedo = false,
}: EditorHeaderProps) {
  const [designName, setDesignName] = useState("Untitled Design")
  const [shareUrl, setShareUrl] = useState("https://designih.com/share/abc123")
  const [exportFormat, setExportFormat] = useState("png")
  const [exportQuality, setExportQuality] = useState(100)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // Show success message
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleExport = () => {
    if (onExport) {
      onExport(exportFormat, exportQuality)
      setShowExportDialog(false)
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <Logo />
        <div className="flex items-center gap-2">
          <Input value={designName} onChange={(e) => setDesignName(e.target.value)} className="h-8 w-40" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="Undo" onClick={onUndo} disabled={!canUndo}>
          <Undo className="h-4 w-4" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button variant="ghost" size="icon" title="Redo" onClick={onRedo} disabled={!canRedo}>
          <Redo className="h-4 w-4" />
          <span className="sr-only">Redo</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share design</DialogTitle>
              <DialogDescription>Share your design with others or on social media.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="share-link">Link</Label>
                <Input id="share-link" value={shareUrl} readOnly />
              </div>
              <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
                <span className="sr-only">Copy</span>
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <Label>Share on social media</Label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export design</DialogTitle>
              <DialogDescription>Choose format and quality for your design.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="export-format">Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(exportFormat === "jpg" || exportFormat === "png") && (
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="quality">Quality</Label>
                    <span className="text-sm text-muted-foreground">{exportQuality}%</span>
                  </div>
                  <Slider
                    id="quality"
                    min={10}
                    max={100}
                    step={10}
                    value={[exportQuality]}
                    onValueChange={(value) => setExportQuality(value[0])}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label>Export Area</Label>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="selection">Selection</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" className="gap-1">
                <Settings className="h-4 w-4" />
                Advanced
              </Button>
              <Button type="submit" className="gap-1" onClick={handleExport}>
                <FileDown className="h-4 w-4" />
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}

// Label component for the dialogs
function Label({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
    >
      {children}
    </label>
  )
}

// Slider component for the export quality
function Slider({
  id,
  min,
  max,
  step,
  value,
  onValueChange,
}: {
  id?: string
  min: number
  max: number
  step: number
  value: number[]
  onValueChange: (value: number[]) => void
}) {
  return (
    <div className="relative flex items-center">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([Number.parseInt(e.target.value)])}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer"
      />
    </div>
  )
}

// Helper function for class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
