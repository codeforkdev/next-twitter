"use client";

import { createUser } from "@/actions/auth";
import { useRef, useState } from "react";

export default function Page() {
  const handleRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const handle = handleRef.current?.value.trim();
    const displayName = displayNameRef.current?.value.trim();
    if (!handle || !displayName) return;
    createUser({ handle, displayName });
  };
  return (
    <div>
      <div>Create user</div>
      <label>Handle</label>
      <input className="text-black" type="text" ref={handleRef} />
      <label>Display Name</label>
      <input className="text-black" type="text" ref={displayNameRef} />
      <button onClick={handleSubmit} type="submit">
        Submit
      </button>
    </div>
  );
}
