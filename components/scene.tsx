"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { ParticleSphere } from "@/components/particle-sphere"

export default function Scene() {
  return (
    <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ParticleSphere />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  )
}
