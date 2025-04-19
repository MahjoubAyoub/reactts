"use client"

import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Rect, Text, Transformer } from "react-konva"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { EditorHeader } from "@/components/editor-header"
import { EditorSidebar } from "@/components/editor-sidebar"
import { EditorElementSettings } from "@/components/editor-element-settings"
import { useRouter } from "next/navigation"

export default function TemplateEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [elements, setElements] = useState<any[]>([
    {
      id: "rect1",
      type: "rect",
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      fill: "#4dabf7",
      draggable: true,
    },
    {
      id: "text1",
      type: "text",
      x: 150,
      y: 150,
      text: "Template Text",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#ffffff",
      draggable: true,
    },
    {
      id: "text2",
      type: "text",
      x: 150,
      y: 200,
      text: "Edit this template",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "#ffffff",
      draggable: true,
    },
  ])
  const stageRef = useRef(null)
  const transformerRef = useRef(null)

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      // Find the selected node
      const selectedNode = stageRef.current.findOne(`#${selectedId}`)
      if (selectedNode) {
        // Attach transformer to the selected node
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer().batchDraw()
      }
    }
  }, [selectedId])

  const handleElementChange = (id: string, newProps: any) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...newProps } : el)))
  }

  const addElement = (type: string) => {
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
        }
        break
      case "text":
        newElement = {
          id,
          type: "text",
          x: 100,
          y: 100,
          text: "New Text",
          fontSize: 20,
          fontFamily: "Arial",
          fill: "#000000",
          draggable: true,
        }
        break
      default:
        return
    }

    setElements([...elements, newElement])
    setSelectedId(id)
  }

  const handleSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id)
  }

  const handleStageClick = (e: any) => {
    // Clicked on stage but not on any element
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  const handleSave = () => {
    // Simulate saving the template as a new design
    router.push("/dashboard/designs")
  }

  const selectedElement = elements.find((el) => el.id === selectedId)

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar onAddElement={addElement} />

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
                          draggable={element.draggable}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => {
                            handleElementChange(element.id, {
                              x: e.target.x(),
                              y: e.target.y(),
                            })
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target
                            handleElementChange(element.id, {
                              x: node.x(),
                              y: node.y(),
                              width: node.width() * node.scaleX(),
                              height: node.height() * node.scaleY(),
                              scaleX: 1,
                              scaleY: 1,
                            })
                          }}
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
                          fill={element.fill}
                          draggable={element.draggable}
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => {
                            handleElementChange(element.id, {
                              x: e.target.x(),
                              y: e.target.y(),
                            })
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target
                            handleElementChange(element.id, {
                              x: node.x(),
                              y: node.y(),
                              fontSize: element.fontSize * node.scaleX(),
                              scaleX: 1,
                              scaleY: 1,
                            })
                          }}
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
                    />
                  )}
                </Layer>
              </Stage>
            </div>

            <div className="mt-4 flex justify-center">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save as My Design
              </Button>
            </div>
          </div>
        </div>

        {selectedElement && (
          <EditorElementSettings
            element={selectedElement}
            onChange={(props) => handleElementChange(selectedElement.id, props)}
          />
        )}
      </div>
    </div>
  )
}
