import { useRef } from "react";
import { useArmScene } from "../hooks/useArmScene.js";

export default function ArmCanvas({ axisRef, ambientOnly = false }) {
  const canvasRef = useRef(null);
  useArmScene(canvasRef, axisRef, ambientOnly);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
