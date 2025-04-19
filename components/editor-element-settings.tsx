"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCw,
} from "lucide-react"

// Font options
const fontOptions = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
]

interface EditorElementSettingsProps {
  element: any
  onChange: (props: any) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onMoveForward?: (id: string) => void
  onMoveBackward?: (id: string) => void
  onToggleVisibility?: (id: string, visible: boolean) => void
  onToggleLock?: (id: string, locked: boolean) => void
}

export function EditorElementSettings({
  element,
  onChange,
  onDelete,
  onDuplicate,
  onMoveForward,
  onMoveBackward,
  onToggleVisibility,
  onToggleLock,
}: EditorElementSettingsProps) {
  const [localElement, setLocalElement] = useState(element)
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
  })

  // Update local state when element prop changes
  useEffect(() => {
    setLocalElement(element)

    // Parse text style from element if it's a text element
    if (element.type === "text") {
      setTextStyle({
        bold: element.fontStyle?.includes("bold") || false,
        italic: element.fontStyle?.includes("italic") || false,
        underline: element.textDecoration?.includes("underline") || false,
        align: element.align || "left",
      })
    }
  }, [element])

  // Handle immediate changes
  const handleChange = (props: any) => {
    // Update local state
    const updated = { ...localElement, ...props }
    setLocalElement(updated)

    // Propagate changes to parent component
    onChange(props)
  }

  const handleTextStyleChange = (style: string, value: boolean | string) => {
    const newStyle = { ...textStyle }
    const props: any = {}

    if (style === "bold" || style === "italic") {
      newStyle[style] = value as boolean

      // Update fontStyle
      let fontStyle = ""
      if (newStyle.bold) fontStyle += "bold "
      if (newStyle.italic) fontStyle += "italic"
      fontStyle = fontStyle.trim() || "normal"

      props.fontStyle = fontStyle
    } else if (style === "underline") {
      newStyle[style] = value as boolean
      props.textDecoration = value ? "underline" : ""
    } else if (style === "align") {
      newStyle.align = value as string
      props.align = value
    }

    setTextStyle(newStyle)
    onChange(props)
  }

  const handleColorChange = (color: string) => {
    handleChange({ fill: color })
  }

  return (
    <div className="w-72 border-l bg-background p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Element Settings</h3>
        <div className="flex gap-1">
          {onToggleVisibility && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleVisibility(element.id, !element.visible)}
              title={element.visible ? "Hide" : "Show"}
            >
              {element.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          )}
          {onToggleLock && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleLock(element.id, !element.locked)}
              title={element.locked ? "Unlock" : "Lock"}
            >
              {element.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
          )}
          {onDuplicate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDuplicate(element.id)}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(element.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="style">
        <TabsList className="w-full">
          <TabsTrigger value="style" className="flex-1">
            Style
          </TabsTrigger>
          <TabsTrigger value="position" className="flex-1">
            Position
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex-1">
            Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="mt-4 space-y-4">
          {element.type === "text" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="text">Text</Label>
                <Input
                  id="text"
                  value={localElement.text}
                  onChange={(e) => {
                    // Update immediately for real-time feedback
                    const newText = e.target.value
                    setLocalElement({ ...localElement, text: newText })
                    onChange({ text: newText })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font</Label>
                <Select value={localElement.fontFamily} onValueChange={(value) => handleChange({ fontFamily: value })}>
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={textStyle.bold ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("bold", !textStyle.bold)}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.italic ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("italic", !textStyle.italic)}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.underline ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("underline", !textStyle.underline)}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex gap-2">
                  <Button
                    variant={textStyle.align === "left" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("align", "left")}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.align === "center" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("align", "center")}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.align === "right" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("align", "right")}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={textStyle.align === "justify" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTextStyleChange("align", "justify")}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <span className="text-sm">{localElement.fontSize}px</span>
                </div>
                <Slider
                  id="fontSize"
                  min={8}
                  max={72}
                  step={1}
                  value={[localElement.fontSize]}
                  onValueChange={(value) => handleChange({ fontSize: value[0] })}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="fill">Fill Color</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-8 p-0" style={{ backgroundColor: localElement.fill }} />
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        "#000000",
                        "#FF0000",
                        "#00FF00",
                        "#0000FF",
                        "#FFFF00",
                        "#FF00FF",
                        "#00FFFF",
                        "#FFFFFF",
                        "#808080",
                        "#800000",
                        "#808000",
                        "#008000",
                        "#800080",
                        "#008080",
                        "#000080",
                        "#FFA500",
                        "#A52A2A",
                        "#FFC0CB",
                        "#90EE90",
                        "#ADD8E6",
                      ].map((color) => (
                        <Button
                          key={color}
                          variant="outline"
                          className="h-6 w-6 p-0 rounded-sm"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                    <Input type="color" value={localElement.fill} onChange={(e) => handleColorChange(e.target.value)} />
                    <Input
                      type="text"
                      value={localElement.fill}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#RRGGBB"
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Input id="fill" value={localElement.fill} onChange={(e) => handleChange({ fill: e.target.value })} />
            </div>
          </div>

          {element.type === "rect" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="width">Width</Label>
                  <span className="text-sm">{Math.round(localElement.width)}px</span>
                </div>
                <Slider
                  id="width"
                  min={10}
                  max={500}
                  step={1}
                  value={[localElement.width]}
                  onValueChange={(value) => handleChange({ width: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="height">Height</Label>
                  <span className="text-sm">{Math.round(localElement.height)}px</span>
                </div>
                <Slider
                  id="height"
                  min={10}
                  max={500}
                  step={1}
                  value={[localElement.height]}
                  onValueChange={(value) => handleChange({ height: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cornerRadius">Corner Radius</Label>
                  <span className="text-sm">{localElement.cornerRadius || 0}px</span>
                </div>
                <Slider
                  id="cornerRadius"
                  min={0}
                  max={100}
                  step={1}
                  value={[localElement.cornerRadius || 0]}
                  onValueChange={(value) => handleChange({ cornerRadius: value[0] })}
                />
              </div>
            </>
          )}

          {element.type === "image" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="width">Width</Label>
                  <span className="text-sm">{Math.round(localElement.width)}px</span>
                </div>
                <Slider
                  id="width"
                  min={10}
                  max={500}
                  step={1}
                  value={[localElement.width]}
                  onValueChange={(value) => handleChange({ width: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="height">Height</Label>
                  <span className="text-sm">{Math.round(localElement.height)}px</span>
                </div>
                <Slider
                  id="height"
                  min={10}
                  max={500}
                  step={1}
                  value={[localElement.height]}
                  onValueChange={(value) => handleChange({ height: value[0] })}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="position" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Layer Position</Label>
            <div className="flex gap-2">
              {onMoveForward && (
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => onMoveForward(element.id)}>
                  <MoveUp className="h-4 w-4" />
                  Forward
                </Button>
              )}
              {onMoveBackward && (
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => onMoveBackward(element.id)}>
                  <MoveDown className="h-4 w-4" />
                  Backward
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="x" className="text-xs">
                  X
                </Label>
                <Input
                  id="x"
                  type="number"
                  value={Math.round(localElement.x)}
                  onChange={(e) => handleChange({ x: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="y" className="text-xs">
                  Y
                </Label>
                <Input
                  id="y"
                  type="number"
                  value={Math.round(localElement.y)}
                  onChange={(e) => handleChange({ y: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rotation">Rotation</Label>
              <span className="text-sm">{Math.round(localElement.rotation || 0)}°</span>
            </div>
            <div className="flex items-center gap-2">
              <Slider
                id="rotation"
                min={0}
                max={360}
                step={1}
                value={[localElement.rotation || 0]}
                onValueChange={(value) => handleChange({ rotation: value[0] })}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ rotation: 0 })}
                title="Reset rotation"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opacity">Opacity</Label>
              <span className="text-sm">{Math.round((localElement.opacity || 1) * 100)}%</span>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.01}
              value={[localElement.opacity || 1]}
              onValueChange={(value) => handleChange({ opacity: value[0] })}
            />
          </div>

          {(element.type === "rect" || element.type === "image") && (
            <>
              <div className="space-y-2">
                <Label>Shadow</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="shadow-toggle"
                    checked={!!localElement.shadowEnabled}
                    onCheckedChange={(checked) => {
                      const shadowProps = checked
                        ? {
                            shadowEnabled: true,
                            shadowColor: localElement.shadowColor || "rgba(0,0,0,0.5)",
                            shadowBlur: localElement.shadowBlur || 5,
                            shadowOffsetX: localElement.shadowOffsetX || 5,
                            shadowOffsetY: localElement.shadowOffsetY || 5,
                          }
                        : {
                            shadowEnabled: false,
                          }
                      handleChange(shadowProps)
                    }}
                  />
                  <Label htmlFor="shadow-toggle">Enable Shadow</Label>
                </div>

                {localElement.shadowEnabled && (
                  <div className="grid gap-2 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="shadowColor" className="text-xs">
                        Shadow Color
                      </Label>
                      <div className="flex gap-2">
                        <div
                          className="h-8 w-8 rounded-md border"
                          style={{ backgroundColor: localElement.shadowColor || "rgba(0,0,0,0.5)" }}
                        />
                        <Input
                          id="shadowColor"
                          value={localElement.shadowColor || "rgba(0,0,0,0.5)"}
                          onChange={(e) => handleChange({ shadowColor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shadowBlur" className="text-xs">
                          Blur
                        </Label>
                        <span className="text-xs">{localElement.shadowBlur || 5}px</span>
                      </div>
                      <Slider
                        id="shadowBlur"
                        min={0}
                        max={30}
                        step={1}
                        value={[localElement.shadowBlur || 5]}
                        onValueChange={(value) => handleChange({ shadowBlur: value[0] })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="shadowOffsetX" className="text-xs">
                          Offset X
                        </Label>
                        <Input
                          id="shadowOffsetX"
                          type="number"
                          value={localElement.shadowOffsetX || 5}
                          onChange={(e) => handleChange({ shadowOffsetX: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="shadowOffsetY" className="text-xs">
                          Offset Y
                        </Label>
                        <Input
                          id="shadowOffsetY"
                          type="number"
                          value={localElement.shadowOffsetY || 5}
                          onChange={(e) => handleChange({ shadowOffsetY: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {element.type === "image" && (
            <div className="space-y-2">
              <Label htmlFor="filter">Image Filter</Label>
              <Select value={localElement.filter || "none"} onValueChange={(value) => handleChange({ filter: value })}>
                <SelectTrigger id="filter">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="sepia">Sepia</SelectItem>
                  <SelectItem value="invert">Invert</SelectItem>
                  <SelectItem value="blur">Blur</SelectItem>
                  <SelectItem value="brightness">Brightness</SelectItem>
                  <SelectItem value="contrast">Contrast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
