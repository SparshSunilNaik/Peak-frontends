"use client";

import React, { useState, useCallback } from "react";
import AIThinkingOrb, { OrbState } from "./ai-thinking-orb-and-input";

/* -----------------------------------------------------------------------
   Demo: simulates a real back-end round-trip with a 2 s "thinking" phase.
   Swap `fakeBackend` for a real fetch() call to wire up a live LLM.
   ----------------------------------------------------------------------- */

const FAKE_RESPONSES: Record<string, string> = {
  default: "I'm a thinking orb — a morphing UI component that signals AI activity through motion and shape. The pill collapses to a pulsing sphere while I reason, then expands into a card when I'm ready.",
  hello:   "Hello there! I'm alive — well, as alive as a CSS animation can be. Ask me anything.",
  why:     "Because a spinning gradient sphere is infinitely more satisfying than a plain spinner, and the best interfaces feel like they're thinking alongside you.",
  how:     "Under the hood it's a single React component driving ~20 spring-animated CSS custom properties on each animation frame, plus a rotating conic-gradient ring and four aurora blobs.",
};

function pick(prompt: string): string {
  const key = prompt.toLowerCase();
  if (key.includes("hello") || key.includes("hi")) return FAKE_RESPONSES.hello;
  if (key.includes("why"))  return FAKE_RESPONSES.why;
  if (key.includes("how"))  return FAKE_RESPONSES.how;
  return FAKE_RESPONSES.default;
}

async function fakeBackend(prompt: string): Promise<string> {
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
  if (prompt.toLowerCase().includes("error")) throw new Error("Simulated error");
  return pick(prompt);
}

export default function ThinkingOrbDemo() {
  const [state, setState]    = useState<OrbState>("idle");
  const [response, setResponse] = useState("");

  const handleSubmit = useCallback(async (text: string) => {
    setState("listening");
    await new Promise(r => setTimeout(r, 300));
    setState("thinking");
    try {
      const res = await fakeBackend(text);
      setResponse(res);
      setState("done");
    } catch {
      setState("error");
      await new Promise(r => setTimeout(r, 2200));
      setState("idle");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setResponse("");
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <AIThinkingOrb
        state={state}
        responseText={response}
        onPromptSubmit={handleSubmit}
      />
      {/* Reset button — only shown when in done/error state */}
      {(state === "done" || state === "error") && (
        <button
          onClick={handleReset}
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            padding: "8px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.07)",
            color: "#f2f2f5",
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
