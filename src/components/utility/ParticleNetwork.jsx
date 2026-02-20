import React, { useEffect, useRef } from "react";

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Configuration
    const particleCount = width < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouseDistance = 200;

    const particles = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Light background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, "#f3f4f6");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = i % 5 === 0 ? "#DC2626" : "#9CA3AF";
        ctx.fill();

        // Connect particles to each other
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(209, 213, 219, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const dxMouse = p.x - mouseX;
        const dyMouse = p.y - mouseY;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouseDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(220, 38, 38, ${1 - distMouse / mouseDistance})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    const animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId); // Added for memory safety
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className=" pointer-events-auto"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0, // أو -1 حسب رغبتك في الطبقات
        background: "transparent",
      }} // Ensures no scrollbar issues
    />
  );
};

export default ParticleNetwork;
