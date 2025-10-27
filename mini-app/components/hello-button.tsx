"use client";

import { useState, useEffect } from "react";
import { claimHello } from "@/lib/blockchain";

export default function HelloButton() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lastClaim = localStorage.getItem("lastClaim");
    if (lastClaim) {
      const lastDate = new Date(lastClaim);
      const now = new Date();
      if (lastDate.toDateString() === now.toDateString()) {
        setDisabled(true);
      }
    }
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPoints = await claimHello();
      setPoints(newPoints);
      localStorage.setItem("lastClaim", new Date().toISOString());
      setDisabled(true);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Say hello to earn $YoYo"}
      </button>
      {points > 0 && <span className="text-green-600">Points: {points}</span>}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}
