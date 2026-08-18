/**
 * Particle System
 * Gerencia efeitos visuais como faíscas, explosões e auras
 */

class Particle {
    constructor(x, y, vx, vy, color, size, lifespan) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLifespan = lifespan;
        this.lifespan = lifespan;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifespan -= dt;
        this.size = Math.max(0, this.size * 0.96);
    }

    render(ctx) {
        const alpha = Math.max(0, this.lifespan / this.maxLifespan);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
    }

    createExplosion(x, y, color = '#2ecc71', count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
            const speed = 40 + Math.random() * 80;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const size = 3 + Math.random() * 3;
            const lifespan = 0.3 + Math.random() * 0.3;
            this.particles.push(new Particle(x, y, vx, vy, color, size, lifespan));
        }
    }

    createTrail(x, y, color = '#3498db') {
        const vx = (Math.random() - 0.5) * 15;
        const vy = (Math.random() - 0.5) * 15;
        this.particles.push(new Particle(x, y, vx, vy, color, 3, 0.25));
    }

    createFloatingText(text, x, y, color = '#ffffff') {
        this.floatingTexts.push({
            text,
            x,
            y,
            color,
            lifespan: 0.8,
            maxLifespan: 0.8
        });
    }

    update(dt = 0.016) {
        // Atualizar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            if (p.lifespan <= 0 || p.size <= 0.2) {
                this.particles.splice(i, 1);
            }
        }

        // Atualizar textos flutuantes
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 30 * dt;
            ft.lifespan -= dt;
            if (ft.lifespan <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // Renderizar partículas
        this.particles.forEach(p => p.render(ctx));

        // Renderizar textos flutuantes
        this.floatingTexts.forEach(ft => {
            const alpha = Math.max(0, ft.lifespan / ft.maxLifespan);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = ft.color;
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        });
    }

    clear() {
        this.particles = [];
        this.floatingTexts = [];
    }
}

const particleSystem = new ParticleSystem();
