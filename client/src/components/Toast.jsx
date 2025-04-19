"use client"

import { useEffect, useState } from "react"

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const bgColor = {
    success: "bg-[oklch(47.3%_0.137_46.201)]",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  }[type]

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center`}>
      <span className="mr-2">{message}</span>
      <button
        onClick={() => {
          setVisible(false)
          onClose()
        }}
        className="ml-auto text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  )
}
