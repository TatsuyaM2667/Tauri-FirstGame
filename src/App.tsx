import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [pos, setPos] = useState({ x: 500, y: 400 });
  const requestRef = useRef<number | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const SPEED = 6; // 少し速めに設定

  const update = () => {
    setPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (keysPressed.current["ArrowUp"]) newY -= SPEED;
      if (keysPressed.current["ArrowDown"]) newY += SPEED;
      if (keysPressed.current["ArrowLeft"]) newX -= SPEED;
      if (keysPressed.current["ArrowRight"]) newX += SPEED;

      // 画面端の判定
      const x = Math.max(0, Math.min(window.innerWidth - 50, newX));
      const y = Math.max(0, Math.min(window.innerHeight - 50, newY));

      // 座標が変わっていないならステート更新をスキップ（負荷軽減）
      if (x === prev.x && y === prev.y) return prev;
      return { x, y };
    });
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    invoke<string>("get_system_info")
      .then((res) => console.log("System Info:", res))
      .catch(console.error);

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      className="player"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "50px",
        height: "50px",
        backgroundColor: "red",
        // left/topではなく、transformを使用（残像対策）
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        // 矢印キー操作の反応を良くするため、transitionは絶対に切る
        transition: "none",
        willChange: "transform",
      }}
    />
  );
}

export default App;
