import React from 'react'

function BlurCircle({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) {
  return (
    <div
      className="absolute -z-50 w-56 h-56 aspect-square rounded-full bg-primary/30 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  )
}

export default BlurCircle
