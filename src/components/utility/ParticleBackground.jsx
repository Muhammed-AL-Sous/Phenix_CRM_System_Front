import React, { useEffect, useRef } from "react";

class Particle {
  constructor(x, y, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;

    // سرعة عشوائية هادئة
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;

    // ألوان Phenix (أحمر صارخ وأبيض شفاف)
    const color = Math.random() > 0.3 ? "220, 38, 38" : "255, 255, 255";

    // ألوان رمادية زرقاء خفيفة جداً لتعطي عمق بدون إزعاج
    // const color = Math.random() > 0.8 ? "220, 38, 38" : "203, 213, 225";
    //  this.color = `rgba(${color}, 0.15)`; // شفافية منخفضة جداً
    this.baseColor = color;
  }

  update(mouse) {
    // حركة الارتداد عن الحواف
    if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;

    // منطق "الهروب" من الماوس
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;

    // المسافة التي يبدأ عندها التأثير (100 بكسل)
    let maxDistance = 100;
    let force = (maxDistance - distance) / maxDistance;

    if (distance < maxDistance) {
      this.x -= forceDirectionX * force * 5;
      this.y -= forceDirectionY * force * 5;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    this.ctx.fillStyle = `rgba(${this.baseColor}, 0.6)`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

export const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      // عدد الجزيئات بناءً على حجم الشاشة
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(0, 0, canvas, ctx));
      }
    };

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(220, 38, 38, ${1 - distance / 150})`;
            // في دالة connect (الخطوط):
            // ctx.strokeStyle = `rgba(226, 232, 240, 0.4)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(mouse.current);
        p.draw();
      });
      connect();
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999, // أو -1 حسب رغبتك في الطبقات
        background: "transparent",
      }}
    />
  );
};
