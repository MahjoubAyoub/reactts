"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Layers,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LayerPanelProps {
  elements: any[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onToggleVisibility: (id: string, visible: boolean) => void
  onToggleLock: (id: string, locked: boolean) => void
}

export function LayerPanel({
  elements,
  selectedId,
  onSelect,
  onRename,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onToggleLock,
}: LayerPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  // Add this near the top of the component
  useEffect(() => {
    // If the selected element was deleted or hidden, clear selection
    if (selectedId && !elements.some((el) => el.id === selectedId && el.visible !== false)) {
      onSelect(null)
    }

    // If editing an element that no longer exists, stop editing
    if (editingId && !elements.some((el) => el.id === editingId)) {
      setEditingId(null)
    }
  }, [elements, selectedId, editingId, onSelect])

  // Filter elements based on search term
  const filteredElements = elements.filter((element) => {
    const elementName = element.name || getDefaultName(element)
    return elementName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Get default name for element based on type
  const getDefaultName = (element: any) => {
    switch (element.type) {
      case "text":
        return element.text?.substring(0, 20) || "Text"
      case "rect":
        return "Rectangle"
      case "ellipse":
        return "Circle"
      case "regularPolygon":
        return element.sides === 3 ? "Triangle" : `Polygon (${element.sides} sides)`
      case "star":
        return "Star"
      case "image":
        return "Image"
      case "path":
        return "Path"
      case "icon":
        return "Icon"
      default:
        return "Element"
    }
  }

  // Start editing layer name
  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  // Save edited layer name
  const saveEditing = () => {
    if (editingId) {
      onRename(editingId, editingName)
      setEditingId(null)
    }
  }

  return (
    <div className="w-64 border-l bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-1">
            <Layers className="h-4 w-4" />
            Layers
          </h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => selectedId && onMoveUp(selectedId)}
              disabled={!selectedId}
              title="Move Up"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => selectedId && onMoveDown(selectedId)}
              disabled={!selectedId}
              title="Move Down"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search layers..."
            className="pl-8 h-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-350px)]">
        <div className="p-2">
          {filteredElements.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">No layers found</div>
          ) : (
            <div className="space-y-1">
              {filteredElements.map((element, index) => {
                const elementName = element.name || getDefaultName(element)

                return (
                  <div
                    key={element.id}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2 py-1 text-sm",
                      selectedId === element.id ? "bg-muted" : "hover:bg-muted/50",
                    )}
                  >
                    <div
                      className="flex items-center gap-1 flex-1 min-w-0 cursor-pointer"
                      onClick={() => onSelect(element.id)}
                    >
                      <div className="flex-shrink-0">
                        {element.type === "group" ? (
                          element.expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        ) : null}
                      </div>

                      {editingId === element.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={saveEditing}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditing()
                            if (e.key === "Escape") setEditingId(null)
                          }}
                          className="h-6 py-0 px-1 text-xs"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="truncate flex-1"
                          onDoubleClick={() => startEditing(element.id, elementName)}
                          title={elementName}
                        >
                          {elementName}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onToggleVisibility(element.id, !element.visible)}
                        title={element.visible ? "Hide" : "Show"}
                      >
                        {element.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onToggleLock(element.id, !element.locked)}
                        title={element.locked ? "Unlock" : "Lock"}
                      >
                        {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDuplicate(element.id)}
                        title="Duplicate"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => onDelete(element.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
