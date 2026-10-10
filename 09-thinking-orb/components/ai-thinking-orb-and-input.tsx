"use client";

import React, { useEffect, useRef, useCallback } from "react";
import "../index.css";

/* ---------- tiny spring helpers ---------- */
type Spring = { v: number; x: number; target: number };
function makeSpring(x = 0): Spring { return { v: 0, x, target: x }; }
function tickSpring(s: Spring, stiffness = 180, damping = 26, dt = 1 / 60) {
  const F = -stiffness * (s.x - s.target) - damping * s.v;
  s.v += F * dt; s.x += s.v * dt;
}

/* ---------- lerp util ---------- */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- types ---------- */
export type OrbState =
  | "idle"       // pill resting
  | "listening"  // user typed / pill lights up
  | "thinking"   // morphed to ball, dots spinning
  | "done"       // green flash → expand to card
  | "error";     // red flash

export interface AIThinkingOrbProps {
  state?: OrbState;
  responseText?: string;
  onPromptSubmit?: (text: string) => void;
  className?: string;
}

/* =========================================================
   The orb + input, fully self-contained visual component.
   Pure CSS animations are in index.css.
   ========================================================= */
export default function AIThinkingOrb({
  state: externalState,
  responseText = "",
  onPromptSubmit,
  className = "",
}: AIThinkingOrbProps) {

  /* ------ refs ------ */
  const rootRef    = useRef<HTMLDivElement>(null);
  const actorRef   = useRef<HTMLDivElement>(null);
  const moverRef   = useRef<HTMLDivElement>(null);
  const trailRef   = useRef<HTMLDivElement>(null);
  const haloRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const dotsRef    = useRef<HTMLDivElement>(null);
  const checkRef   = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const responseRef= useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  /* Springs for CSS-var interpolated values */
  const sw    = useRef(makeSpring(480)); // width
  const sh    = useRef(makeSpring(60));  // height
  const sr    = useRef(makeSpring(999)); // border-radius
  const sGlow = useRef(makeSpring(1));
  const sPill = useRef(makeSpring(1));
  const sBall = useRef(makeSpring(0));
  const sGreen= useRef(makeSpring(0));
  const sGS   = useRef(makeSpring(0.55));
  const sCard = useRef(makeSpring(0));
  const sCS   = useRef(makeSpring(1));
  const sCardText = useRef(makeSpring(0));
  const sRing = useRef(makeSpring(1));
  const sAur  = useRef(makeSpring(1));
  const sText = useRef(makeSpring(1));
  const sDots = useRef(makeSpring(0));
  const sCheck= useRef(makeSpring(0));
  const sHalo = useRef(makeSpring(0));
  const sCenter= useRef(makeSpring(0));
  const sBloom= useRef(makeSpring(0));
  const sInput= useRef(makeSpring(1));

  /* current orb state */
  const stateRef = useRef<OrbState>("idle");
  const rafRef   = useRef<number>(0);
  const prevState= useRef<OrbState>("idle");

  /* ---- viewport dimensions (updated on resize) ---- */
  const vpW = useRef(0);
  const vpH = useRef(0);

  /* ---- target geometry per state ---- */
  const GEOM = {
    idle:      { w: Math.min(480, vpW.current - 32), h: 60,  r: 999 },
    listening: { w: Math.min(480, vpW.current - 32), h: 60,  r: 999 },
    thinking:  { w: 84,  h: 84,  r: 999 },
    done:      { w: Math.min(560, vpW.current - 32), h: Math.min(320, vpH.current * 0.55), r: 20 },
    error:     { w: Math.min(480, vpW.current - 32), h: 60,  r: 999 },
  };

  /* ---- helper: set CSS var on the actor element ---- */
  const setVar = useCallback((name: string, val: string | number) => {
    actorRef.current?.style.setProperty(name, String(val));
  }, []);

  /* ---- flash: add/remove a data attr for CSS selector ---- */
  const flash = useCallback((attr: "data-flash" | "data-shake" | "data-typing", ms = 400) => {
    const el = actorRef.current; if (!el) return;
    el.setAttribute(attr, "");
    setTimeout(() => el.removeAttribute(attr), ms);
  }, []);

  /* ---- transition to a new state ---- */
  const transition = useCallback((next: OrbState, text?: string) => {
    if (stateRef.current === next) return;
    prevState.current = stateRef.current;
    stateRef.current  = next;

    const g = GEOM[next] ?? GEOM.idle;
    sw.current.target  = g.w;
    sh.current.target  = g.h;
    sr.current.target  = g.r;

    if (next === "idle") {
      sGlow.current.target = 1; sPill.current.target = 1;
      sBall.current.target = 0; sGreen.current.target = 0; sGS.current.target = 0.55;
      sCard.current.target = 0; sCS.current.target = 1; sCardText.current.target = 0;
      sRing.current.target = 1; sAur.current.target = 1;
      sText.current.target = 1; sDots.current.target = 0;
      sCheck.current.target= 0; sHalo.current.target = 0;
      sCenter.current.target = 0; sBloom.current.target = 0;
      sInput.current.target = 1;
      if (labelRef.current) { labelRef.current.textContent = ""; labelRef.current.className = "mo-label"; }
    }
    if (next === "listening") {
      sGlow.current.target = 1; sPill.current.target = 1;
      sBall.current.target = 0; sGreen.current.target = 0;
      sCard.current.target = 0; sRing.current.target = 1; sAur.current.target = 1;
      sText.current.target = 1; sDots.current.target = 0; sCheck.current.target = 0;
      sHalo.current.target = 0; sCenter.current.target = 0; sBloom.current.target = 0;
      sInput.current.target = 1;
      if (labelRef.current && text) { labelRef.current.textContent = text; labelRef.current.className = "mo-label"; }
      flash("data-typing", 999999); // keep typing ring while listening
    }
    if (next === "thinking") {
      sGlow.current.target = 0; sPill.current.target = 0;
      sBall.current.target = 1; sGreen.current.target = 0;
      sCard.current.target = 0; sRing.current.target = 0; sAur.current.target = 0;
      sText.current.target = 0; sDots.current.target = 1; sCheck.current.target = 0;
      sHalo.current.target = 0; sCenter.current.target = 1; sBloom.current.target = 0;
      sInput.current.target = 0;
      actorRef.current?.removeAttribute("data-typing");
    }
    if (next === "done") {
      // brief green → then expand
      sGreen.current.target = 1; sGS.current.target = 1;
      sHalo.current.target = 1;
      sCenter.current.target = 0;
      setTimeout(() => {
        sGreen.current.target = 0;
        sCard.current.target = 1; sCS.current.target = 1; sBloom.current.target = 1;
        sRing.current.target = 0; sAur.current.target = 0;
        sBall.current.target = 0;
        setTimeout(() => {
          sCardText.current.target = 1;
          if (responseRef.current && text) {
            responseRef.current.innerHTML = text;
            responseRef.current.className = "mo-response mo-shimmer-text";
            setTimeout(() => { if (responseRef.current) responseRef.current.className = "mo-response"; }, 2400);
          }
          sCheck.current.target = 1;
        }, 400);
      }, 600);
      sInput.current.target = 0;
    }
    if (next === "error") {
      sGlow.current.target = 1; sPill.current.target = 1;
      sBall.current.target = 0; sGreen.current.target = 0;
      sCard.current.target = 0; sRing.current.target = 1; sAur.current.target = 1;
      sText.current.target = 1; sDots.current.target = 0; sCheck.current.target = 0;
      sHalo.current.target = 0; sCenter.current.target = 0; sBloom.current.target = 0;
      sInput.current.target = 1;
      if (labelRef.current && text) { labelRef.current.textContent = text; labelRef.current.className = "mo-label mo-label--flash"; }
      flash("data-flash"); flash("data-shake");
      actorRef.current?.removeAttribute("data-typing");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash]);

  /* ---- animation loop ---- */
  const tick = useCallback(() => {
    const DT = 1 / 60;
    const STIFF = 200, DAMP = 28;
    const springs = [sw, sh, sr, sGlow, sPill, sBall, sGreen, sGS, sCard, sCS, sCardText, sRing, sAur, sText, sDots, sCheck, sHalo, sCenter, sBloom, sInput];
    springs.forEach(s => tickSpring(s.current, STIFF, DAMP, DT));

    const vw = vpW.current; const vh = vpH.current;
    const w = Math.max(60, Math.min(sw.current.x, vw - 32));
    const h = Math.max(60, Math.min(sh.current.x, vh * 0.7));
    const r = Math.max(10, sr.current.x);

    setVar("--w", `${w}px`); setVar("--h", `${h}px`); setVar("--r", `${r}px`);
    setVar("--oGlow",     sGlow.current.x.toFixed(3));
    setVar("--oPill",     sPill.current.x.toFixed(3));
    setVar("--oBall",     sBall.current.x.toFixed(3));
    setVar("--oGreen",    sGreen.current.x.toFixed(3));
    setVar("--gs",        sGS.current.x.toFixed(3));
    setVar("--oCard",     sCard.current.x.toFixed(3));
    setVar("--cs",        sCS.current.x.toFixed(3));
    setVar("--oCardText", sCardText.current.x.toFixed(3));
    setVar("--oRing",     sRing.current.x.toFixed(3));
    setVar("--oAur",      sAur.current.x.toFixed(3));
    setVar("--oText",     sText.current.x.toFixed(3));
    setVar("--oDots",     sDots.current.x.toFixed(3));
    setVar("--oCheck",    sCheck.current.x.toFixed(3));
    setVar("--oHalo",     sHalo.current.x.toFixed(3));
    setVar("--oCenter",   sCenter.current.x.toFixed(3));
    setVar("--bloom",     sBloom.current.x.toFixed(3));
    setVar("--oInput",    sInput.current.x.toFixed(3));

    // pointer-events on input row
    if (actorRef.current) {
      (actorRef.current.parentElement?.querySelector(".mo-input-row") as HTMLElement)?.style.setProperty(
        "--peInput", sInput.current.x > 0.3 ? "auto" : "none");
    }
    // halo position follows mover (stays at center CSS via fixed %)
    if (haloRef.current) {
      haloRef.current.style.opacity = String(lerp(0, sCenter.current.x, 1));
    }

    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVar]);

  /* ---- lifecycle ---- */
  useEffect(() => {
    const updateVP = () => { vpW.current = window.innerWidth; vpH.current = window.innerHeight; };
    updateVP();
    window.addEventListener("resize", updateVP);
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", updateVP); };
  }, [tick]);

  /* ---- react to external state prop ---- */
  useEffect(() => {
    if (!externalState) return;
    transition(externalState, responseText || undefined);
  }, [externalState, responseText, transition]);

  /* ---- input submit ---- */
  const handleSubmit = useCallback(() => {
    const val = inputRef.current?.value.trim();
    if (!val) { flash("data-shake"); return; }
    if (inputRef.current) inputRef.current.value = "";
    onPromptSubmit?.(val);
  }, [flash, onPromptSubmit]);

  /* ---- render ---- */
  return (
    <div ref={rootRef} className={`mo-root ${className}`}>
      <div className="mo-bg" />
      <div ref={haloRef} className="mo-halo" />

      <div ref={moverRef} className="mo-mover">
        <div ref={trailRef} className="mo-trail" />

        <div ref={actorRef} className="mo-actor">
          {/* glow underglow */}
          <div className="mo-underglow" />
          <div className="mo-halo-green" />

          {/* layers */}
          <div className="mo-surface">
            <div className="mo-aurora">
              <i /><i /><i /><i />
            </div>
          </div>
          <div className="mo-ball" />
          <div className="mo-green" />
          <div ref={cardRef} className="mo-card" />
          <div className="mo-ring" />

          {/* content */}
          <div className="mo-content">
            <div className="mo-content-inner">
              <div ref={dotsRef} className="mo-dots">
                <span /><span /><span />
              </div>
              <span ref={labelRef} className="mo-label" />
              <div ref={checkRef} className="mo-check">
                <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
              </div>
            </div>
          </div>

          {/* card text */}
          <div className="mo-card-content">
            <div ref={responseRef} className="mo-response" />
          </div>
        </div>

        {/* input */}
        <div className="mo-input-row">
          <input
            ref={inputRef}
            className="mo-input"
            type="text"
            placeholder="Ask something…"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button className="mo-btn" onClick={handleSubmit}>Send</button>
        </div>
        <div className="mo-hint">Press Enter or click Send</div>
      </div>
    </div>
  );
}
