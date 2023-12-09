"use client";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};
export function Spotlight(props: Props) {
  const [cursor, setCurosr] = useState({ x: 0, y: 0 });
  return (
    <>
      <div
        onMouseMove={(e) => {
          const { clientX, clientY } = e;
          setCurosr({ x: clientX, y: clientY });
        }}
        className="opacity-1  fixed left-0 top-0 flex h-screen w-full flex-col justify-center"
        style={{}}
      >
        {props.children}
      </div>
      <div
        className="opacity-1 pointer-events-none fixed left-0 top-0 h-screen w-full"
        style={{
          background: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, #00000000 10px, #000000ee 2500px)`,
        }}
      />
    </>
  );
}
