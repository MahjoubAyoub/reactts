"use client"

import { useState, useCallback } from "react"
import { EditorElement } from "@/types/editor"

interface EditorState {
  elements: EditorElement[]
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  updateElement: (id: string, props: Partial<EditorElement>, addToHistory?: boolean) => void
  addElement: (elementOrType: EditorElement | string, props?: Partial<EditorElement>) => void
  undo: () => void
  redo: () => void
}

export function useEditorState(initialElements: EditorElement[] = []): EditorState {
  const [elements, setElements] = useState<EditorElement[]>(initialElements)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<EditorElement[][]>([initialElements])
  const [historyIndex, setHistoryIndex] = useState(0)

  const addToHistory = useCallback((newElements: EditorElement[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newElements]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const updateElement = useCallback((id: string, props: Partial<EditorElement>, shouldAddToHistory: boolean = false) => {
    setElements(prev => {
      const updated = prev.map(el => {
        if (el.id === id) {
          return { ...el, ...props }
        }
        return el
      })

      if (shouldAddToHistory) {
        addToHistory(updated)
      }
      return updated
    })
  }, [addToHistory])

  const addElement = useCallback((elementOrType: EditorElement | string, props: Partial<EditorElement> = {}) => {
    if (typeof elementOrType === 'string') {
      const id = `${elementOrType}${Date.now()}`
      const defaultProps = {
        x: 100,
        y: 100,
        fill: "#4dabf7",
        draggable: true,
        visible: true,
        locked: false,
        name: props.name || elementOrType.charAt(0).toUpperCase() + elementOrType.slice(1),
        scaleX: 1,
        scaleY: 1,
      }

      let specificProps = {}
      switch (elementOrType) {
        case 'rect':
          specificProps = {
            width: props.width || 100,
            height: props.height || 100,
          }
          break
        case 'circle':
          specificProps = {
            radius: props.radius || 50,
          }
          break
        case 'ellipse':
          specificProps = {
            radiusX: props.radiusX || 50,
            radiusY: props.radiusY || 30,
          }
          break
        case 'regularPolygon':
          specificProps = {
            sides: props.sides || 3,
            radius: props.radius || 50,
          }
          break
        case 'star':
          specificProps = {
            numPoints: props.numPoints || 5,
            innerRadius: props.innerRadius || 20,
            outerRadius: props.outerRadius || 50,
          }
          break
        case 'text':
          specificProps = {
            text: props.text || 'New Text',
            fontSize: props.fontSize || 20,
            fontFamily: props.fontFamily || 'Arial',
            fontStyle: props.fontStyle || 'normal',
            align: props.align || 'left',
          }
          break
      }

      const newElement: EditorElement = {
        id,
        type: elementOrType,
        ...defaultProps,
        ...specificProps,
        ...props,
      }

      setElements(prev => {
        const updated = [...prev, newElement]
        addToHistory(updated)
        return updated
      })
      setSelectedId(id)
    } else {
      setElements(prev => {
        const updated = [...prev, elementOrType]
        addToHistory(updated)
        return updated
      })
      setSelectedId(elementOrType.id)
    }
  }, [addToHistory])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setElements(history[historyIndex - 1])
      setSelectedId(null)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setElements(history[historyIndex + 1])
      setSelectedId(null)
    }
  }, [history, historyIndex])

  return {
    elements,
    selectedId,
    setSelectedId,
    updateElement,
    addElement,
    undo,
    redo
  }
}
