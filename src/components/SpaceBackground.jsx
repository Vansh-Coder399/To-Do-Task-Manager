import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;

        const stars = [];
        const STAR_COUNT = 250;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Generate stars
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.5 + 0.2,
                alpha: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.3 + 0.05,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: ['#ffffff', '#a5c9ff', '#c4a9ff', '#ffaaaa'][Math.floor(Math.random() * 4)],
            });
        }

        let t = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.016;

            stars.forEach((s) => {
                const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset);
                ctx.globalAlpha = s.alpha * twinkle;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();

                // Drift slowly
                s.y += s.speed * 0.1;
                if (s.y > canvas.height) {
                    s.y = 0;
                    s.x = Math.random() * canvas.width;
                }
            });

            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        }

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
