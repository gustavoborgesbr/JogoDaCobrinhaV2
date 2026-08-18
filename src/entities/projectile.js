/**
 * Projectile System
 * Disparos da cobra, inimigos e chefões
 */

class Projectile {
    constructor(x, y, vx, vy, isPlayer = true, damage = 1, color = '#2ecc71', radius = 5) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isPlayer = isPlayer;
        this.damage = damage;
        this.color = color;
        this.radius = radius;
        this.isDead = false;
        this.lifespan = 3.0; // segundos
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifespan -= dt;

        if (this.lifespan <= 0) {
            this.isDead = true;
        }

        // Deixar partículas de rastro
        if (Math.random() < 0.4 && typeof particleSystem !== 'undefined') {
            particleSystem.createTrail(this.x, this.y, this.color);
        }

        // Colisão com bordas da tela
        if (this.x < 0 || this.x > grid.width || this.y < 0 || this.y > grid.height) {
            this.isDead = true;
            if (typeof particleSystem !== 'undefined') {
                particleSystem.createExplosion(this.x, this.y, this.color, 4);
            }
        }
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo brilhante
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    getGridPosition() {
        return grid.pixelsToGrid(this.x, this.y);
    }
}

class ProjectilePool {
    constructor() {
        this.projectiles = [];
    }

    spawn(x, y, vx, vy, isPlayer = true, damage = 1, color = '#2ecc71', radius = 5) {
        const p = new Projectile(x, y, vx, vy, isPlayer, damage, color, radius);
        this.projectiles.push(p);
        return p;
    }

    updateAll(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt);
            if (p.isDead) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    renderAll(ctx) {
        this.projectiles.forEach(p => p.render(ctx));
    }

    getAll() {
        return this.projectiles;
    }

    clear() {
        this.projectiles = [];
    }
}

const projectilePool = new ProjectilePool();
