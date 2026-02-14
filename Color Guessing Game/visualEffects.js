// RGB Master - Visual Effects Engine
class VisualFX {
    constructor() {
        this.canvas = document.getElementById('hex-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.hexagons = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.gridSize = 50;
        this.t = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        this.createHexGrid();
        this.startIntro();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createHexGrid();
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Parallax for UI
        const mainUI = document.getElementById('mainGameContainer');
        if (mainUI && mainUI.classList.contains('active')) {
            const moveX = (window.innerWidth / 2 - e.clientX) * 0.015;
            const moveY = (window.innerHeight / 2 - e.clientY) * 0.015;
            mainUI.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        // Magnetic Buttons
        const buttons = document.querySelectorAll('.control-btn, .mode-btn');
        buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

            if (dist < 100) {
                const magneticX = (e.clientX - centerX) * 0.4;
                const magneticY = (e.clientY - centerY) * 0.4;
                btn.style.transform = `translate(${magneticX}px, ${magneticY}px)`;
                btn.style.transition = 'none';
            } else {
                btn.style.transform = 'translate(0, 0)';
                btn.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
            }
        });
    }

    createHexGrid() {
        this.hexagons = [];
        const r = this.gridSize;
        const h = r * Math.sin(Math.PI / 3);
        const w = 1.5 * r;

        for (let y = 0; y < this.canvas.height + h; y += h) {
            for (let x = 0; x < this.canvas.width + w; x += w) {
                const offsetX = (Math.floor(y / h) % 2) * (r * 0.75);
                this.hexagons.push({
                    x: x + offsetX,
                    y: y,
                    baseOpacity: 0.05 + Math.random() * 0.05,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    drawHexagon(x, y, r, opacity) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + r * Math.cos(angle);
            const py = y + r * Math.sin(angle);
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    startIntro() {
        const intro = document.getElementById('introOverlay');
        const mainUI = document.getElementById('mainGameContainer');

        setTimeout(() => {
            intro.classList.add('fade-out');
            mainUI.classList.add('active');

            // Trigger sound if available
            this.playStaticSound('correct');
        }, 2500);
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 3 + 1,
                color,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02
            });
        }
    }

    playStaticSound(type) {
        // Placeholder for audio integration - could use Web Audio API
        console.log(`Sound Effect: ${type}`);
    }

    animate() {
        this.t += 0.01;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Hexagons
        this.hexagons.forEach(hex => {
            const dist = Math.sqrt(Math.pow(hex.x - this.mouseX, 2) + Math.pow(hex.y - this.mouseY, 2));
            const hoverEffect = Math.max(0, 1 - dist / 300);
            const pulse = Math.sin(this.t + hex.phase) * 0.02;
            const opacity = hex.baseOpacity + hoverEffect * 0.2 + pulse;

            this.drawHexagon(hex.x, hex.y, this.gridSize * 0.95, opacity);
        });

        // Update & Draw Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace('rgb', 'rgba').replace(')', `, ${p.life})`);
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initial loading delay to feel cinematic
window.addEventListener('load', () => {
    window.vFX = new VisualFX();
});
