"use client"

import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Rect, Text, Circle, RegularPolygon, Transformer, Star, Ellipse } from "react-konva"
import { EditorHeader } from "@/components/editor-header"
import { EditorSidebar } from "@/components/editor-sidebar"
import { EditorElementSettings } from "@/components/editor-element-settings"
import { useRouter } from "next/navigation"
import { useEditorState } from "@/hooks/use-editor-state"
import { EditorElement } from "@/types/editor"
import Konva from "konva"

export default function NewEditorPage() {
  const router = useRouter()
  const {
    elements,
    selectedId,
    setSelectedId,
    updateElement,
    addElement,
    undo,
    redo
  } = useEditorState([])

  const [stageConfig, setStageConfig] = useState({
    scale: 1,
    x: 0,
    y: 0,
    width: Math.min(window.innerWidth - 400, 1200),
    height: Math.min(window.innerHeight - 120, 800)
  });

  useEffect(() => {
    const handleResize = () => {
      setStageConfig(prev => ({
        ...prev,
        width: Math.min(window.innerWidth - 400, 1200),
        height: Math.min(window.innerHeight - 120, 800)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    if (!e.evt.ctrlKey) return;

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageConfig({
      ...stageConfig,
      scale: newScale,
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    });
  };

  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        const layer = transformerRef.current.getLayer()
        if (layer) {
          layer.batchDraw()
        }
      }
    }
  }, [selectedId])

  const handleSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id)
  }

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  const handleDragEnd = (e: any, id: string) => {
    const node = e.target;
    const stage = node.getStage();
    const stageBox = stage.container().getBoundingClientRect();
    const stageScale = stage.scaleX();
    
    // Get the actual position relative to the stage
    const x = node.x();
    const y = node.y();

    updateElement(id, {
      x,
      y
    }, true);
  }

  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target
    const element = elements.find((el) => el.id === id)

    if (!element) return

    let updatedProps: Partial<EditorElement> = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    }

    switch (element.type) {
      case "rect":
      case "image":
        updatedProps = {
          ...updatedProps,
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
        }
        break
      case "circle":
        updatedProps = {
          ...updatedProps,
          radius: node.radius() * node.scaleX(),
        }
        break
      case "ellipse":
        updatedProps = {
          ...updatedProps,
          radiusX: node.radiusX() * node.scaleX(),
          radiusY: node.radiusY() * node.scaleY(),
        }
        break
      case "regularPolygon":
        updatedProps = {
          ...updatedProps,
          radius: node.radius() * node.scaleX(),
        }
        break
      case "star":
        const star = element as EditorElement & { innerRadius?: number; outerRadius?: number }
        updatedProps = {
          ...updatedProps,
          innerRadius: (star.innerRadius || 20) * node.scaleX(),
          outerRadius: (star.outerRadius || 50) * node.scaleX(),
        }
        break
      case "text":
        const text = element as EditorElement & { fontSize?: number }
        updatedProps = {
          ...updatedProps,
          fontSize: (text.fontSize || 20) * node.scaleX(),
        }
        break
    }

    updateElement(id, updatedProps, true)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const selectedElement = elements.find((el) => el.id === selectedId)

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader 
        onUndo={undo}
        onRedo={redo}
        onSave={() => console.log("Saving design...")}
        onExport={() => console.log("Exporting design...")}
        canUndo={true}
        canRedo={true}
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar onAddElement={addElement} />

        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Stage
                ref={stageRef}
                width={stageConfig.width}
                height={stageConfig.height}
                scaleX={stageConfig.scale}
                scaleY={stageConfig.scale}
                x={stageConfig.x}
                y={stageConfig.y}
                draggable={!selectedId}
                onDragEnd={(e) => {
                  setStageConfig({
                    ...stageConfig,
                    x: e.target.x(),
                    y: e.target.y()
                  });
                }}
                onWheel={handleWheel}
                onClick={handleStageClick}
                onTap={handleStageClick}
                className="border border-gray-200"
                style={{ margin: 'auto' }}
              >
                <Layer>
                  {elements.map((element) => {
                    if (!element.visible) return null;
                    
                    switch (element.type) {
                      case "rect":
                        return (
                          <Rect
                            key={element.id}
                            id={element.id}
                            x={element.x}
                            y={element.y}
                            width={element.width || 100}
                            height={element.height || 100}
                            fill={element.fill || "#000000"}
                            draggable={element.draggable}
                            onClick={() => handleSelect(element.id)}
                            onTap={() => handleSelect(element.id)}
                            onDragEnd={(e) => handleDragEnd(e, element.id)}
                            onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                          />
                        )
                      case "circle":
                        return (
                          <Circle
                            key={element.id}
                            id={element.id}
                            x={element.x}
                            y={element.y}
                            radius={element.radius || 50}
                            fill={element.fill || "#000000"}
                            draggable={element.draggable}
                            onClick={() => handleSelect(element.id)}
                            onTap={() => handleSelect(element.id)}
                            onDragEnd={(e) => handleDragEnd(e, element.id)}
                            onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                          />
                        )
                      case "ellipse":
                        return (
                          <Ellipse
                            key={element.id}
                            id={element.id}
                            x={element.x}
                            y={element.y}
                            radiusX={element.radiusX || 50}
                            radiusY={element.radiusY || 30}
                            fill={element.fill || "#000000"}
                            draggable={element.draggable}
                            onClick={() => handleSelect(element.id)}
                            onTap={() => handleSelect(element.id)}
                            onDragEnd={(e) => handleDragEnd(e, element.id)}
                            onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                          />
                        )
                      case "regularPolygon":
                        return (
                          <RegularPolygon
                            key={element.id}
                            id={element.id}
                            x={element.x}
                            y={element.y}
                            sides={element.sides || 3}
                            radius={element.radius || 50}
                            fill={element.fill || "#000000"}
                            draggable={element.draggable}
                            onClick={() => handleSelect(element.id)}
                            onTap={() => handleSelect(element.id)}
                            onDragEnd={(e) => handleDragEnd(e, element.id)}
                            onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                          />
                        )
                      case "star":
                        const star = element as EditorElement & { numPoints?: number, innerRadius?: number, outerRadius?: number }
                        return (
                          <Star
                            key={element.id}
                            id={element.id}
                            x={element.x}
                            y={element.y}
                            numPoints={star.numPoints || 5}
                            innerRadius={star.innerRadius || 20}
                            outerRadius={star.outerRadius || 50}
                            fill={element.fill || "#000000"}
                            draggable={element.draggable}
                            onClick={() => handleSelect(element.id)}
                            onTap={() => handleSelect(element.id)}
                            onDragEnd={(e) => handleDragEnd(e, element.id)}
                            onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                          />
                        )
                      case "text":
                        const text = element as EditorElement & { text?: string, fontSize?: number, fontFamily?: string }
                        return (
                          <Text
                            key={element.id}
                            id={element.id}
                            x={element.x}
                            y={element.y}
                            text={text.text || ""}
                            fontSize={text.fontSize || 20}
                            fontFamily={text.fontFamily || "Arial"}
                            fill={element.fill || "#000000"}
                            draggable={element.draggable}
                            onClick={() => handleSelect(element.id)}
                            onTap={() => handleSelect(element.id)}
                            onDragEnd={(e) => handleDragEnd(e, element.id)}
                            onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                          />
                        )
                      default:
                        return null;
                    }
                  })}
                  {selectedId && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
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
            onChange={(props) => updateElement(selectedElement.id, props, true)}
            onDelete={() => {
              setSelectedId(null)
              const updated = elements.filter(el => el.id !== selectedElement.id)
              // The element will be removed from elements
              updateElement(selectedElement.id, { visible: false }, true)
            }}
            onDuplicate={() => {
              const newElement = {
                ...selectedElement,
                id: `${selectedElement.type}${Date.now()}`,
                x: selectedElement.x + 20,
                y: selectedElement.y + 20,
                name: `${selectedElement.name || "Element"} (copy)`
              }
              addElement(newElement)
            }}
          />
        )}
      </div>
    </div>
  )
}
