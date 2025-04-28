"use client"

import { useEffect, useState, useRef } from "react"
import { Stage, Layer, Rect, Circle, Text, Transformer, Image as KonvaImage, Ellipse, Star, RegularPolygon, Line } from "react-konva"
import { EditorHeader } from "@/components/editor-header"
import { EditorSidebar } from "@/components/editor-sidebar"
import { EditorElementSettings } from "@/components/editor-element-settings"
import { LayerPanel } from "@/components/layer-panel"
import { useRouter } from "next/navigation"
import Konva from "konva"

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
      id: "circle1",
      type: "circle",
      x: 200,
      y: 100,
      radius: 50,
      fill: "#007bff",
      draggable: true,
      name: "Blue Circle",
      visible: true,
      locked: false,
    },
    {
      id: "ellipse1",
      type: "ellipse",
      x: 300,
      y: 100,
      radiusX: 75,
      radiusY: 50,
      fill: "#28a745",
      draggable: true,
      name: "Green Ellipse",
      visible: true,
      locked: false,
    },
    {
      id: "triangle1",
      type: "regularPolygon",
      x: 400,
      y: 100,
      sides: 3,
      radius: 50,
      fill: "#ffc107",
      draggable: true,
      name: "Yellow Triangle",
      visible: true,
      locked: false,
    },
    {
      id: "pentagon1",
      type: "regularPolygon",
      x: 500,
      y: 100,
      sides: 5,
      radius: 50,
      fill: "#6f42c1",
      draggable: true,
      name: "Purple Pentagon",
      visible: true,
      locked: false,
    },
    {
      id: "hexagon1",
      type: "regularPolygon",
      x: 600,
      y: 100,
      sides: 6,
      radius: 50,
      fill: "#e83e8c",
      draggable: true,
      name: "Pink Hexagon",
      visible: true,
      locked: false,
    },
    {
      id: "octagon1",
      type: "regularPolygon",
      x: 700,
      y: 100,
      sides: 8,
      radius: 50,
      fill: "#fd7e14",
      draggable: true,
      name: "Orange Octagon",
      visible: true,
      locked: false,
    },
    {
      id: "star1",
      type: "star",
      x: 400,
      y: 200,
      numPoints: 5,
      innerRadius: 20,
      outerRadius: 50,
      fill: "#17a2b8",
      draggable: true,
      name: "5-Point Star",
      visible: true,
      locked: false,
    },
    {
      id: "star2",
      type: "star",
      x: 500,
      y: 200,
      numPoints: 6,
      innerRadius: 25,
      outerRadius: 50,
      fill: "#20c997",
      draggable: true,
      name: "6-Point Star",
      visible: true,
      locked: false,
    },
    {
      id: "star3",
      type: "star",
      x: 600,
      y: 200,
      numPoints: 8,
      innerRadius: 30,
      outerRadius: 50,
      fill: "#dc3545",
      draggable: true,
      name: "8-Point Star",
      visible: true,
      locked: false,
    },
    {
      id: "text1",
      type: "text",
      x: 300,
      y: 300,
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
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState(false)
  const [currentLine, setCurrentLine] = useState<number[]>([])
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [showLayerPanel, setShowLayerPanel] = useState(true)
  const imageCache = useRef(new Map())

  // Get selected element
  const selectedElement = elements.find((el) => el.id === selectedId)

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
    const stage = stageRef.current
    if (stage) {
      const layer = stage.getLayers()[0]
      if (layer) {
        layer.batchDraw()
      }
    }
  }, [elements])

  useEffect(() => {
    const transformer = transformerRef.current
    const stage = stageRef.current
    if (selectedId && transformer && stage) {
      // Find the selected node
      const selectedNode = stage.findOne(`#${selectedId}`)
      if (selectedNode) {
        // Attach transformer to the selected node
        transformer.nodes([selectedNode])
        transformer.getLayer()?.batchDraw()
      }
    } else if (transformer) {
      // Clear transformer when no element is selected
      transformer.nodes([])
      transformer.getLayer()?.batchDraw()
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

  const handleDeleteElement = (id: string) => {
    const updatedElements = elements.filter((el) => el.id !== id)
    setElements(updatedElements)
    setSelectedId(null)
    addToHistory(updatedElements)
  }

  const handleDuplicateElement = (id: string) => {
    const element = elements.find((el) => el.id === id)
    if (!element) return

    const newElement = {
      ...element,
      id: `${element.type}${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    }

    const updatedElements = [...elements, newElement]
    setElements(updatedElements)
    setSelectedId(newElement.id)
    addToHistory(updatedElements)
  }

  const handleMoveElementUp = (id: string) => {
    const index = elements.findIndex((el) => el.id === id)
    if (index === elements.length - 1) return

    const updatedElements = [...elements]
    const temp = updatedElements[index]
    updatedElements[index] = updatedElements[index + 1]
    updatedElements[index + 1] = temp

    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  const handleMoveElementDown = (id: string) => {
    const index = elements.findIndex((el) => el.id === id)
    if (index === 0) return

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

  const handleSelect = (id: string) => {
    if (drawMode) return;
    
    const element = elements.find((el) => el.id === id);
    if (element && element.locked) return;

    const newSelectedId = id === selectedId ? null : id;
    
    // Update draggable state for all elements
    const updatedElements = elements.map(el => ({
      ...el,
      draggable: el.id === newSelectedId && !el.locked && !drawMode
    }));
    
    setElements(updatedElements);
    setSelectedId(newSelectedId);
  }

  const handleStageClick = (e: any) => {
    // Clicked on stage but not on any element
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  const handleDragStart = (e: any, id: string) => {
    if (drawMode || id !== selectedId) {
      e.target.stopDrag();
      return;
    }
  }

  const handleDragEnd = (e: any, id: string) => {
    if (drawMode) return;

    const node = e.target;
    const stage = node.getStage();
    
    // Get the actual position relative to the stage's transformation
    const stageScale = stage.scaleX();
    const position = node.absolutePosition();
    
    const x = (position.x - stage.x()) / stageScale;
    const y = (position.y - stage.y()) / stageScale;
    
    const updatedElements = elements.map((el) => 
      el.id === id ? { 
        ...el, 
        x,
        y,
        // Reset scale to prevent compound scaling
        scaleX: 1,
        scaleY: 1
      } : el
    );
    
    setElements(updatedElements);
    addToHistory(updatedElements);
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

    switch (element.type) {
      case "rect":
        updatedProps = {
          ...updatedProps,
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
        }
        break
      case "circle":
        updatedProps = {
          ...updatedProps,
          radius: element.radius * node.scaleX(),
        }
        break
      case "ellipse":
        updatedProps = {
          ...updatedProps,
          radiusX: element.radiusX * node.scaleX(),
          radiusY: element.radiusY * node.scaleY(),
        }
        break
      case "star":
        updatedProps = {
          ...updatedProps,
          innerRadius: element.innerRadius * node.scaleX(),
          outerRadius: element.outerRadius * node.scaleX(),
        }
        break
      case "text":
        updatedProps = {
          ...updatedProps,
          fontSize: element.fontSize * node.scaleX(),
        }
        break
    }

    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, ...updatedProps, scaleX: 1, scaleY: 1 } : el
    )
    setElements(updatedElements)
    addToHistory(updatedElements)
  }

  useEffect(() => {
    // Update all elements' draggable state when draw mode changes
    const updatedElements = elements.map(el => ({
      ...el,
      draggable: el.id === selectedId && !drawMode && !el.locked
    }))
    setElements(updatedElements)
  }, [drawMode])

  // Update addElement to set draggable false by default
  const addElement = (type: string, props: any = {}) => {
    const id = `${type}${Date.now()}`
    const stage = stageRef.current
    
    // Calculate center position of the visible stage area
    const centerX = stage ? (stage.width() / 2) - (stage.x() / stage.scaleX()) : 100
    const centerY = stage ? (stage.height() / 2) - (stage.y() / stage.scaleY()) : 100

    let newElement: any = {
      id,
      type,
      x: centerX,
      y: centerY,
      draggable: false,
      visible: true,
      locked: false,
      ...props,
    }

    switch (type) {
      case "rect":
        newElement = {
          ...newElement,
          width: 100,
          height: 100,
          fill: "#4dabf7",
          name: "Rectangle",
        }
        break
      case "circle":
        newElement = {
          ...newElement,
          radius: 50,
          fill: "#4dabf7",
          name: "Circle",
        }
        break
      case "ellipse":
        newElement = {
          ...newElement,
          radiusX: 50,
          radiusY: 30,
          fill: "#4dabf7",
          name: "Ellipse",
        }
        break
      case "regularPolygon":
        newElement = {
          ...newElement,
          sides: props.sides || 3,
          radius: props.radius || 50,
          fill: "#4dabf7",
          name: props.sides === 3 ? "Triangle" : `${props.sides}-sided Polygon`,
        }
        break
      case "star":
        newElement = {
          ...newElement,
          numPoints: props.numPoints || 5,
          innerRadius: props.innerRadius || 20,
          outerRadius: props.outerRadius || 50,
          fill: "#4dabf7",
          name: `${props.numPoints || 5}-Point Star`,
        }
        break
      case "text":
        newElement = {
          ...newElement,
          text: props.text || "New Text",
          fontSize: props.fontSize || 20,
          fontFamily: props.fontFamily || "Arial",
          fontStyle: props.fontStyle || "normal",
          align: props.align || "left",
          fill: "#000000",
          name: props.text || "Text",
        }
        break
      case "image":
        newElement = {
          ...newElement,
          width: props.width || 100,
          height: props.height || 100,
          src: props.src,
          name: "Image",
        }
        break
      case "path":
        newElement = {
          ...newElement,
          points: props.points || [],
          stroke: props.stroke || "#000000",
          strokeWidth: props.strokeWidth || 2,
          name: props.name || "Path",
        };
        break;
    }

    if (newElement) {
      const updatedElements = [...elements, newElement]
      setElements(updatedElements)
      setSelectedId(id)
      addToHistory(updatedElements)
    }
  }

  const handleMouseDown = (e: any) => {
    if (!drawMode) return
    setIsDrawing(true)
    const pos = e.target.getStage()?.getPointerPosition()
    if (pos) setCurrentLine([pos.x, pos.y])
  }

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !drawMode) return
    const pos = e.target.getStage()?.getPointerPosition()
    if (pos) setCurrentLine([...currentLine, pos.x, pos.y])
  }

  const handleMouseUp = () => {
    if (!isDrawing || !drawMode) return
    setIsDrawing(false)
    if (currentLine.length >= 4) {
      addElement("path", {
        points: currentLine,
        stroke: "#000000",
        strokeWidth: 2,
        name: "Drawing",
      })
    }
    setCurrentLine([])
  }

  const handleUploadImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        const width = 200
        const height = (img.height / img.width) * width
        imageCache.current.set(src, img)
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

    const link = document.createElement("a")
    link.download = `designih-export.${format}`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update elements to enforce draggable state
  const renderElement = (element: any) => {
    const isSelected = selectedId === element.id;
    const canDrag = isSelected && !drawMode && !element.locked;
    const commonProps = {
      key: element.id,
      id: element.id,
      x: element.x,
      y: element.y,
      draggable: canDrag,
      rotation: element.rotation || 0,
      opacity: element.opacity || 1,
      onClick: () => handleSelect(element.id),
      onTap: () => handleSelect(element.id),
      onDragStart: (e: any) => handleDragStart(e, element.id),
      onDragEnd: (e: any) => handleDragEnd(e, element.id),
      onTransformEnd: (e: any) => handleTransformEnd(e, element.id),
    };

    switch (element.type) {
      case "rect":
        return (
          <Rect
            {...commonProps}
            width={element.width}
            height={element.height}
            fill={element.fill}
            cornerRadius={element.cornerRadius || 0}
            shadowEnabled={element.shadowEnabled}
            shadowColor={element.shadowColor}
            shadowBlur={element.shadowBlur}
            shadowOffsetX={element.shadowOffsetX}
            shadowOffsetY={element.shadowOffsetY}
          />
        );
      case "circle":
        return (
          <Circle
            {...commonProps}
            radius={element.radius}
            fill={element.fill}
            shadowEnabled={element.shadowEnabled}
            shadowColor={element.shadowColor}
            shadowBlur={element.shadowBlur}
            shadowOffsetX={element.shadowOffsetX}
            shadowOffsetY={element.shadowOffsetY}
          />
        );
      case "ellipse":
        return (
          <Ellipse
            {...commonProps}
            radiusX={element.radiusX}
            radiusY={element.radiusY}
            fill={element.fill}
            shadowEnabled={element.shadowEnabled}
            shadowColor={element.shadowColor}
            shadowBlur={element.shadowBlur}
            shadowOffsetX={element.shadowOffsetX}
            shadowOffsetY={element.shadowOffsetY}
          />
        );
      case "regularPolygon":
        return (
          <RegularPolygon
            {...commonProps}
            sides={element.sides}
            radius={element.radius}
            fill={element.fill}
            shadowEnabled={element.shadowEnabled}
            shadowColor={element.shadowColor}
            shadowBlur={element.shadowBlur}
            shadowOffsetX={element.shadowOffsetX}
            shadowOffsetY={element.shadowOffsetY}
          />
        );
      case "star":
        return (
          <Star
            {...commonProps}
            numPoints={element.numPoints}
            innerRadius={element.innerRadius}
            outerRadius={element.outerRadius}
            fill={element.fill}
            shadowEnabled={element.shadowEnabled}
            shadowColor={element.shadowColor}
            shadowBlur={element.shadowBlur}
            shadowOffsetX={element.shadowOffsetX}
            shadowOffsetY={element.shadowOffsetY}
          />
        );
      case "text":
        return (
          <Text
            {...commonProps}
            text={element.text}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fontStyle={element.fontStyle || "normal"}
            textDecoration={element.textDecoration || ""}
            align={element.align || "left"}
            fill={element.fill}
          />
        );
      case "path":
        return (
          <Line
            {...commonProps}
            points={element.points}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
          />
        );
      default:
        return null;
    }
  };

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
        <EditorSidebar 
          onAddElement={addElement}
          onUploadImage={handleUploadImage}
          onToggleDrawMode={() => setDrawMode(!drawMode)}
          isDrawing={drawMode}
        />

        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Stage
                ref={stageRef}
                width={Math.min(window.innerWidth - 400, 1200)}
                height={Math.min(window.innerHeight - 120, 800)}
                onClick={handleStageClick}
                onTap={handleStageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="border border-gray-200"
                style={{ margin: 'auto', cursor: drawMode ? 'crosshair' : 'default' }}
              >
                <Layer>
                  {elements.map((element) => !element.visible ? null : renderElement(element))}
                  {isDrawing && (
                    <Line
                      points={currentLine}
                      stroke="#000000"
                      strokeWidth={2}
                    />
                  )}
                  {selectedId && !drawMode && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit minimum size
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox
                        }
                        return newBox
                      }}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        {selectedElement && !drawMode && (
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
