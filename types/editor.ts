export interface EditorElement {
  id: string
  type: string
  x: number
  y: number
  width?: number
  height?: number
  fill?: string
  draggable?: boolean
  name?: string
  visible?: boolean
  locked?: boolean
  rotation?: number
  opacity?: number
  scaleX?: number
  scaleY?: number
  shadowEnabled?: boolean
  shadowColor?: string
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  cornerRadius?: number
  // Circle properties
  radius?: number
  // Ellipse properties
  radiusX?: number
  radiusY?: number
  // Regular polygon properties
  sides?: number
  // Star properties
  numPoints?: number
  innerRadius?: number
  outerRadius?: number
  // Text properties
  text?: string
  fontSize?: number
  fontFamily?: string
  fontStyle?: string
  textDecoration?: string
  align?: string
  // Image properties
  src?: string
  filter?: string
}