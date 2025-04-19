"use client"

import { useEffect, useState, useRef } from "react"
import { Stage, Layer, Rect, Text, Transformer, Image as KonvaImage, Ellipse, Star } from "react-konva"
import { EditorHeader } from "@/components/editor-header"
import { EditorSidebar } from "@/components/editor-sidebar"
import { EditorElementSettings } from "@/components/editor-element-settings"
import { LayerPanel } from "@/components/layer-panel"
import { useRouter } from "next/navigation"

export default function EditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [elements, setElements] = useState<any[]>([
    {
      id: "rect1",
      type: "rect",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: "#ff7700",
      draggable: true,
      name: "Orange Rectangle",
      visible: true,
      locked: false,
    },
    {
      id: "text1",
      type: "text",
      x: 300,
      y: 100,
      text: "Edit this text",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#000000",
      draggable: true,
      name: "Sample Text",
      visible: true,
      locked: false,
    },
  ])
  const [history, setHistory] = useState<any[][]>([elements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const stageRef = useRef(null)
  const transformerRef = useRef(null)
  const [showLayerPanel, setShowLayerPanel] = useState(true)

  // Image cache to prevent flickering
  const imageCache = useRef(new Map())

  // Add to history when elements change
  const addToHistory = (newElements: any[]) => {
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)
    // Add new state to history
    newHistory.push([...newElements])
    // Update history state
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements([...history[historyIndex - 1]])
      setSelectedId(null)
    }
  }

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements([...history[historyIndex + 1]])
      setSelectedId(null)
    }
  }

  // Force Konva layer update whenever elements change
  useEffect(() => {
    if (stageRef.current) {
      const layer = stageRef.current.getLayers()[0]
      if (layer) {
        layer.batchDraw()
      }
    }
  }, [elements])

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      // Find the selected node
      const selectedNode = stageRef.current.findOne(`#${selectedId}`)
      if (selectedNode) {
        // Attach transformer to the selected node
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer().batchDraw()
      }
    } else if (transformerRef.current) {
      // Clear transformer when no element is selected
      transformerRef.current.nodes([])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [selectedId])

  const handleElementChange = (id: string, newProps: any) => {
    // Create a new array with updated elements to ensure React detects the change
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, ...newProps } : el))

    // Update state with the new elements array
    setElements(updatedElements)

    // Force Konva to update immediately
    setTimeout(() => {
      if (stageRef.current) {
        const layer = stageRef.current.getLayers()[0]
        if (layer) {
          layer.batchDraw()
        }
      }
    }, 0)
  }

  const addElement = (type: string, props: any = {}) => {
    const id = `${type}${Date.now()}`
    let newElement

    switch (type) {
      case "rect":
        newElement = {
          id,
          type: "rect",
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          fill: "#4dabf7",
          draggable: true,
          name: "Rectangle",
          visible: true,
          locked: false,
          ...props,
        }
        break
      case "ellipse":
        newElement = {
          id,
          type: "ellipse",
          x: 100,
          y: 100,
          radiusX: 50,
          radiusY: 50,
          fill: "#4dabf7",
          draggable: true,
          name: "Circle",
          visible: true,
          locked: false,
          ...props,
        }
        break
      case "text":
        newElement = {
          id,
          type: "text",
          x: 100,
          y: 100,
          text: props.text || "New Text",
          fontSize: props.fontSize || 20,
          fontFamily: props.fontFamily || "Arial",
          fontStyle: props.fontStyle || "normal",
          align: props.align || "left",
          fill: "#000000",
          draggable: true,
          name: "Text",
          visible: true,
          locked: false,
          ...props,
        }
        break
      case "image":
        newElement = {
          id,
          type: "image",
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          src: props.src || "/placeholder.svg?height=200&width=200",
          draggable: true,
          name: "Image",
          visible: true,
          locked: false,
          ...props,
        }
        break
      case "star":
        newElement = {
          id,
          type: "star",
          x: 100,
          y: 100,
          numPoints: props.numPoints || 5,
          innerRadius: props.innerRadius || 20,
          outerRadius: props.outerRadius || 50,
          fill: "#FFD700",
          draggable: true,
          name: "Star",
          visible: true,
          locked: false,
          ...props,
        }
        break
      default:
        return
    }

    const updatedElements = [...elements, newElement]
    setElements(updatedElements)
    setSelectedId(id)
    addToHistory(updatedElements)

    // Force Konva to update immediately
    setTimeout(() => {
      if (stageRef.current) {
        const layer = stageRef.current.getLayers()[0]
        if (layer) {
          layer.batchDraw()
        }
      }
    }, 0)
  }

  const handleSelect = (id: string) => {
    // Don't select locked elements
    const element = elements.find((el) => el.id === id)
    if (element && element.locked) return

    setSelectedId(id === selectedId ? null : id)
  }

  const handleStageClick = (e: any) => {
    // Clicked on stage but not on any element
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  const handleDragEnd = (e: any, id: string) => {
    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        return {
          ...el,
          x: e.target.x(),
          y: e.target.y(),
        }
      }
      return el
    })
    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target
    const element = elements.find((el) => el.id === id)

    if (!element) return

    let updatedProps: any = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    }

    if (element.type === "rect" || element.type === "image") {
      updatedProps = {
        ...updatedProps,
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
        scaleX: 1,
        scaleY: 1,
      }
    } else if (element.type === "ellipse") {
      updatedProps = {
        ...updatedProps,
        radiusX: node.radiusX() * node.scaleX(),
        radiusY: node.radiusY() * node.scaleY(),
        scaleX: 1,
        scaleY: 1,
      }
    } else if (element.type === "text") {
      updatedProps = {
        ...updatedProps,
        fontSize: element.fontSize * node.scaleX(),
        scaleX: 1,
        scaleY: 1,
      }
    } else if (element.type === "star") {
      updatedProps = {
        ...updatedProps,
        innerRadius: element.innerRadius * node.scaleX(),
        outerRadius: element.outerRadius * node.scaleX(),
        scaleX: 1,
        scaleY: 1,
      }
    }

    const updatedElements = elements.map((el) => (el.id === id ? { ...el, ...updatedProps } : el))

    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  const handleDeleteElement = (id: string) => {
    const updatedElements = elements.filter((el) => el.id !== id)
    setElements(updatedElements)
    setSelectedId(null)
    addToHistory(updatedElements)
  }

  const handleDuplicateElement = (id: string) => {
    const elementToDuplicate = elements.find((el) => el.id === id)
    if (!elementToDuplicate) return

    const newElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}${Date.now()}`,
      x: elementToDuplicate.x + 20,
      y: elementToDuplicate.y + 20,
      name: `${elementToDuplicate.name || "Element"} (copy)`,
    }

    const updatedElements = [...elements, newElement]
    setElements(updatedElements)
    setSelectedId(newElement.id)
    addToHistory(updatedElements)
  }

  const handleMoveElementUp = (id: string) => {
    const index = elements.findIndex((el) => el.id === id)
    if (index === elements.length - 1) return // Already at top

    const updatedElements = [...elements]
    const temp = updatedElements[index]
    updatedElements[index] = updatedElements[index + 1]
    updatedElements[index + 1] = temp

    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  const handleMoveElementDown = (id: string) => {
    const index = elements.findIndex((el) => el.id === id)
    if (index === 0) return // Already at bottom

    const updatedElements = [...elements]
    const temp = updatedElements[index]
    updatedElements[index] = updatedElements[index - 1]
    updatedElements[index - 1] = temp

    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  const handleToggleVisibility = (id: string, visible: boolean) => {
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, visible } : el))
    setElements(updatedElements)
    addToHistory(updatedElements)

    // Force Konva to update immediately
    setTimeout(() => {
      if (stageRef.current) {
        const layer = stageRef.current.getLayers()[0]
        if (layer) {
          layer.batchDraw()
        }
      }
    }, 0)
  }

  const handleToggleLock = (id: string, locked: boolean) => {
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, locked, draggable: !locked } : el))
    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  const handleRenameElement = (id: string, name: string) => {
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, name } : el))
    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  // Get or create cached image
  const getCachedImage = (src: string) => {
    if (!imageCache.current.has(src)) {
      const img = new window.Image()
      img.src = src
      imageCache.current.set(src, img)
    }
    return imageCache.current.get(src)
  }

  const handleUploadImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const width = 200
        const height = (img.height / img.width) * width

        // Cache the image
        imageCache.current.set(src, img)

        // Add the element
        addElement("image", { src, width, height, name: file.name })
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const handleExport = (format: string, quality: number) => {
    if (!stageRef.current) return

    const stage = stageRef.current
    let dataURL

    switch (format) {
      case "png":
        dataURL = stage.toDataURL({ pixelRatio: (quality / 100) * 3 })
        break
      case "jpg":
        dataURL = stage.toDataURL({ pixelRatio: (quality / 100) * 3, mimeType: "image/jpeg" })
        break
      default:
        dataURL = stage.toDataURL()
    }

    // Create a download link
    const link = document.createElement("a")
    link.download = `designih-export.${format}`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const selectedElement = elements.find((el) => el.id === selectedId)

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => console.log("Saving design...")}
        onExport={handleExport}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar onAddElement={addElement} onUploadImage={handleUploadImage} />

        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="mx-auto max-w-5xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Stage
                ref={stageRef}
                width={800}
                height={600}
                onClick={handleStageClick}
                onTap={handleStageClick}
                className="border border-gray-200"
              >
                <Layer>
                  {elements.map((element) => {
                    if (!element.visible) return null

                    if (element.type === "rect") {
                      return (
                        <Rect
                          key={element.id}
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          fill={element.fill}
                          cornerRadius={element.cornerRadius || 0}
                          draggable={element.draggable && !element.locked}
                          rotation={element.rotation || 0}
                          opacity={element.opacity || 1}
                          shadowEnabled={element.shadowEnabled}
                          shadowColor={element.shadowColor}
                          shadowBlur={element.shadowBlur}
                          shadowOffsetX={element.shadowOffsetX}
                          shadowOffsetY={element.shadowOffsetY}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(e, element.id)}
                          onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                        />
                      )
                    } else if (element.type === "text") {
                      return (
                        <Text
                          key={element.id}
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          text={element.text}
                          fontSize={element.fontSize}
                          fontFamily={element.fontFamily}
                          fontStyle={element.fontStyle || "normal"}
                          textDecoration={element.textDecoration || ""}
                          align={element.align || "left"}
                          fill={element.fill}
                          draggable={element.draggable && !element.locked}
                          rotation={element.rotation || 0}
                          opacity={element.opacity || 1}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(e, element.id)}
                          onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                        />
                      )
                    } else if (element.type === "image") {
                      // Use the cached image
                      const image = getCachedImage(element.src)

                      return (
                        <KonvaImage
                          key={element.id}
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          image={image}
                          draggable={element.draggable && !element.locked}
                          rotation={element.rotation || 0}
                          opacity={element.opacity || 1}
                          shadowEnabled={element.shadowEnabled}
                          shadowColor={element.shadowColor}
                          shadowBlur={element.shadowBlur}
                          shadowOffsetX={element.shadowOffsetX}
                          shadowOffsetY={element.shadowOffsetY}
                          filters={element.filter && element.filter !== "none" ? [element.filter] : []}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(e, element.id)}
                          onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                        />
                      )
                    } else if (element.type === "ellipse") {
                      return (
                        <Ellipse
                          key={element.id}
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          radiusX={element.radiusX}
                          radiusY={element.radiusY}
                          fill={element.fill}
                          draggable={element.draggable && !element.locked}
                          rotation={element.rotation || 0}
                          opacity={element.opacity || 1}
                          shadowEnabled={element.shadowEnabled}
                          shadowColor={element.shadowColor}
                          shadowBlur={element.shadowBlur}
                          shadowOffsetX={element.shadowOffsetX}
                          shadowOffsetY={element.shadowOffsetY}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(e, element.id)}
                          onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                        />
                      )
                    } else if (element.type === "star") {
                      return (
                        <Star
                          key={element.id}
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          numPoints={element.numPoints}
                          innerRadius={element.innerRadius}
                          outerRadius={element.outerRadius}
                          fill={element.fill}
                          draggable={element.draggable && !element.locked}
                          rotation={element.rotation || 0}
                          opacity={element.opacity || 1}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(e, element.id)}
                          onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                        />
                      )
                    }
                    return null
                  })}
                  {selectedId && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit minimum size
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox
                        }
                        return newBox
                      }}
                      rotateEnabled={true}
                      enabledAnchors={[
                        "top-left",
                        "top-center",
                        "top-right",
                        "middle-right",
                        "middle-left",
                        "bottom-left",
                        "bottom-center",
                        "bottom-right",
                      ]}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        {selectedElement && (
          <EditorElementSettings
            element={selectedElement}
            onChange={(props) => handleElementChange(selectedElement.id, props)}
            onDelete={handleDeleteElement}
            onDuplicate={handleDuplicateElement}
            onMoveForward={(id) => handleMoveElementUp(id)}
            onMoveBackward={(id) => handleMoveElementDown(id)}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
          />
        )}

        {showLayerPanel && (
          <LayerPanel
            elements={elements}
            selectedId={selectedId}
            onSelect={handleSelect}
            onRename={handleRenameElement}
            onDelete={handleDeleteElement}
            onDuplicate={handleDuplicateElement}
            onMoveUp={handleMoveElementUp}
            onMoveDown={handleMoveElementDown}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
          />
        )}
      </div>
    </div>
  )
}
