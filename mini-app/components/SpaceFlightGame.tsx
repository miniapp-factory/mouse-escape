"use client";

import { useEffect, useRef, useState } from "react";

const WIDTH = 800;
const HEIGHT = 600;

interface Meteor {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function SpaceFlightGame() {
  const [shipX, setShipX] = useState(WIDTH / 2);
  const [shipY, setShipY] = useState(HEIGHT - 50);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMeteors((prev) => {
        const newMeteors = prev
          .map((m) => ({ ...m, y: m.y + m.speed }))
          .filter((m) => m.y < HEIGHT + 50);

        // spawn new meteors
        const spawnCount = Math.random() < 0.1 ? 1 : 0;
        for (let i = 0; i < spawnCount; i++) {
          const size = Math.random() * 30 + 10;
          newMeteors.push({
            id: nextId.current++,
            x: Math.random() * (WIDTH - size),
            y: -size,
            size,
            speed: Math.random() * 5 + 3,
          });
        }

        // collision detection
        for (const m of newMeteors) {
          if (
            m.x < shipX + 20 &&
            m.x + m.size > shipX - 20 &&
            m.y < shipY + 20 &&
            m.y + m.size > shipY - 20
          ) {
            setGameOver(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return newMeteors;
          }
        }

        // update score
        const dodged = newMeteors.filter((m) => m.y > HEIGHT + 50).length;
        setScore((s) => s + dodged);

        return newMeteors;
      });
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shipX, shipY]);

  const move = (dx: number, dy: number) => {
    setShipX((x) => Math.max(0, Math.min(WIDTH, x + dx)));
    setShipY((y) => Math.max(0, Math.min(HEIGHT, y + dy)));
  };

  const restart = () => {
    setMeteors([]);
    setScore(0);
    setGameOver(false);
    setShipX(WIDTH / 2);
    setShipY(HEIGHT - 50);
  };

  return (
    <div
      className="relative w-[800px] h-[600px] bg-black overflow-hidden"
    >
      {/* Starfield background */}
      <div className="absolute inset-0">
        <Starfield />
      </div>

      {/* Ship */}
      <div
        className="absolute text-4xl"
        style={{ left: shipX - 20, top: shipY - 20 }}
      >
        🚀
      </div>

      {/* Meteors */}
      {meteors.map((m) => (
        <div
          key={m.id}
          className="absolute bg-green-500 rounded"
          style={{
            left: m.x,
            top: m.y,
            width: m.size,
            height: m.size,
          }}
        />
      ))}

      {/* Score */}
      <div className="absolute top-2 left-2 text-white">
        Score: {score}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          className="p-4 bg-gray-700 rounded"
          onClick={() => move(-10, 0)}
        >
          ←
        </button>
        <button
          className="p-4 bg-gray-700 rounded"
          onClick={() => move(0, -10)}
        >
          ↑
        </button>
        <button
          className="p-4 bg-gray-700 rounded"
          onClick={() => move(0, 10)}
        >
          ↓
        </button>
        <button
          className="p-4 bg-gray-700 rounded"
          onClick={() => move(10, 0)}
        >
          →
        </button>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
          <h1 className="text-4xl mb-4">Game Over</h1>
          <button
            className="px-6 py-3 bg-blue-600 rounded"
            onClick={restart}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

function Starfield() {
  const stars = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    left: Math.random() * 800,
    top: Math.random() * 600,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute bg-white rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );
}
