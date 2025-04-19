"use client"

import { useState, useCallback, useRef } from "react"

export function useEditorState(initialElements = []) {
  // Main elements state
  const [elements, setElements] = useState(initialElements)

  // History management
  const [history, setHistory] = useState([initialElements])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Selection state
  const [selectedId, setSelectedId] = useState(null)

  // Refs for optimization
  const stageRef = useRef(null)
  const transformerRef = useRef(null)
  const imageCache = useRef(new Map())

  // Add to history
  const addToHistory = useCallback(
    (newElements) => {
      setHistory((prev) => {
        // Remove any future history if we're not at the end
        const newHistory = prev.slice(0, historyIndex + 1)
        // Add new state to history
        return [...newHistory, newElements]
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setElements(history[historyIndex - 1])
      setSelectedId(null)
    }
  }, [history, historyIndex])

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setElements(history[historyIndex + 1])
      setSelectedId(null)
    }
  }, [history, historyIndex])

  // Update element
  const updateElement = useCallback(
    (id, newProps, addToHistoryFlag = false) => {
      setElements((prev) => {
        const updated = prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))

        if (addToHistoryFlag) {
          addToHistory(updated)
        }

        return updated
      })
    },
    [addToHistory],
  )

  // Add element
  const addElement = useCallback(
    (element) => {
      setElements((prev) => {
        const updated = [...prev, element]
        addToHistory(updated)
        return updated
      })
      setSelectedId(element.id)
    },
    [addToHistory],
  )

  // Delete element
  const deleteElement = useCallback(
    (id) => {
      setElements((prev) => {
        const updated = prev.filter((el) => el.id !== id)
        addToHistory(updated)
        return updated
      })

      if (selectedId === id) {
        setSelectedId(null)
      }
    },
    [addToHistory, selectedId],
  )

  // Duplicate element
  const duplicateElement = useCallback(
    (id) => {
      const element = elements.find((el) => el.id === id)
      if (!element) return

      const newElement = {
        ...element,
        id: `${element.type}${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
        name: `${element.name || "Element"} (copy)`,
      }

      setElements((prev) => {
        const updated = [...prev, newElement]
        addToHistory(updated)
        return updated
      })

      setSelectedId(newElement.id)
    },
    [elements, addToHistory],
  )

  // Move element in layer stack
  const moveElement = useCallback(
    (id, direction) => {
      const index = elements.findIndex((el) => el.id === id)
      if (index === -1) return

      if (direction === "up" && index < elements.length - 1) {
        setElements((prev) => {
          const updated = [...prev]
          ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
          addToHistory(updated)
          return updated
        })
      } else if (direction === "down" && index > 0) {
        setElements((prev) => {
          const updated = [...prev]
          ;[updated[index], updated[index - 1]] = [updated[index - 1], updated[index]]
          addToHistory(updated)
          return updated
        })
      }
    },
    [elements, addToHistory],
  )

  // Toggle element visibility
  const toggleVisibility = useCallback(
    (id, visible) => {
      updateElement(id, { visible }, true)
    },
    [updateElement],
  )

  // Toggle element lock
  const toggleLock = useCallback(
    (id, locked) => {
      updateElement(id, { locked, draggable: !locked }, true)
    },
    [updateElement],
  )

  // Rename element
  const renameElement = useCallback(
    (id, name) => {
      updateElement(id, { name }, true)
    },
    [updateElement],
  )

  // Get cached image
  const getCachedImage = useCallback((src) => {
    if (!imageCache.current.has(src)) {
      const img = new window.Image()
      img.src = src
      imageCache.current.set(src, img)
    }
    return imageCache.current.get(src)
  }, [])

  return {
    elements,
    selectedId,
    setSelectedId,
    stageRef,
    transformerRef,
    history,
    historyIndex,
    undo,
    redo,
    updateElement,
    addElement,
    deleteElement,
    duplicateElement,
    moveElement,
    toggleVisibility,
    toggleLock,
    renameElement,
    getCachedImage,
  }
}
