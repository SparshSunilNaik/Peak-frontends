"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface GatewayFlowProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  mode?: "light" | "dark";
  speed?: number;
  size?: number;
  gap?: number;
  length?: number;
  density?: number;
  strokeWidth?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
}

export function GatewayFlow({
  className,
  mode = "dark",
  speed = 1,
  size = 100,
  gap = 20,
  length = 50,
  density = 0.5,
  strokeWidth = 1,
  opacity = 0.5,
  hue = 210,
  saturation = 100,
  brightness = 50,
  ...props
}: GatewayFlowProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = `
<!DOCTYPE html>
<html lang="en" class="${mode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; margin: 0; background: #000; color: #fff; overflow: hidden; }
        .gradient-border {
            position: relative;
        }
        .gradient-border::before {
            content: "";
            position: absolute;
            inset: -2px;
            border-radius: 26px;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .gradient-border:hover::before {
            opacity: 1;
        }
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
        }
        .ui-layer {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            pointer-events: none;
        }
        .card {
            pointer-events: auto;
            background: rgba(20, 20, 22, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            width: 380px;
            text-align: center;
        }
        .avatars {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
        }
        .avatars img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid #000;
            margin-left: -12px;
            object-fit: cover;
        }
        .avatars img:first-child { margin-left: 0; }
        .word { display: inline-block; opacity: 0; transform: translateY(10px); }
    </style>
</head>
<body>
    <canvas id="flowCanvas"></canvas>
    
    <div class="ui-layer">
        <div class="card gradient-border">
            <div class="avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar 1">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Avatar 2">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Avatar 3">
            </div>
            <h1 class="text-2xl font-bold mb-2 tracking-tight">
                <span class="word">Nexus</span> <span class="word">Gateway</span>
            </h1>
            <p class="text-gray-400 text-sm mb-8">Authenticate to access the flow control network.</p>
            
            <button class="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <iconify-icon icon="ph:fingerprint-bold" width="20"></iconify-icon>
                Authenticate
            </button>
        </div>
    </div>

    <script>
        // Animate words
        gsap.to(".word", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
        });

        // Canvas Flow Particles
        const canvas = document.getElementById("flowCanvas");
        const ctx = canvas.getContext("2d");
        
        let width, height;
        const particles = [];
        let mouseX = 0, mouseY = 0;
        let ripples = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * ${speed};
                this.vy = (Math.random() - 0.5) * ${speed};
                this.baseX = this.x;
                this.baseY = this.y;
            }
            update() {
                // Converge to center slowly
                const dxCenter = width/2 - this.x;
                const dyCenter = height/2 - this.y;
                this.x += this.vx + dxCenter * 0.001;
                this.y += this.vy + dyCenter * 0.001;

                // Ripple effect
                ripples.forEach(r => {
                    const dx = this.x - r.x;
                    const dy = this.y - r.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < r.radius && dist > r.radius - 20) {
                        this.x += dx * 0.05;
                        this.y += dy * 0.05;
                    }
                });

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, ${strokeWidth}, 0, Math.PI * 2);
                ctx.fillStyle = "hsla(${hue}, ${saturation}%, ${brightness}%, ${opacity})";
                ctx.fill();
            }
        }

        for (let i = 0; i < ${density * 1000}; i++) {
            particles.push(new Particle());
        }

        window.addEventListener("click", (e) => {
            ripples.push({ x: e.clientX, y: e.clientY, radius: 0 });
        });

        function animate() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            ripples.forEach((r, i) => {
                r.radius += 5;
                if (r.radius > 500) ripples.splice(i, 1);
            });

            requestAnimationFrame(animate);
        }
        animate();
    </script>
</body>
</html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      className={cn("w-full h-full border-0 outline-none", className)}
      sandbox="allow-scripts allow-same-origin"
      title="Gateway Flow"
      {...props}
    />
  );
}
