/**
 * Enemy
 * Inimigos que se movem, atacam e deixam recompensas ao serem derrotados
 */

class Enemy {
    constructor(gridX, gridY, type = 'basic') {
        this.gridX = gridX;
        this.gridY = gridY;
        this.type = type;

        this.health = 1;
        this.maxHealth = 1;
        this.speed = 450; // ms por passo
        this.lastMoveTime = Date.now();
        this.lastShootTime = Date.now();
        this.shootRate = 2800; // ms

        this.xpReward = 50;
        this.color = '#e74c3c';
        this.isDead = false;

        // Hit flash
        this.hurtUntil = 0;

        this.setupByType();
        if (window.game && window.game.difficulty) {
            this.speed = this.speed / window.game.difficulty.speedMult;
        }
    }

    setupByType() {
        switch (this.type) {
            case 'fast':
                this.speed = 220;
                this.health = 1;
                this.maxHealth = 1;
                this.xpReward = 80;
                this.color = '#e67e22';
                this.name = 'Morcego Veloz';
                break;
            case 'smart':
                this.speed = 340;
                this.health = 3;
                this.maxHealth = 3;
                this.xpReward = 160;
                this.color = '#9b59b6';
                this.name = 'Esqueleto Mago';
                break;
            case 'tank':
                this.speed = 550;
                this.health = 5;
                this.maxHealth = 5;
                this.xpReward = 250;
                this.color = '#c0392b';
                this.name = 'Golem de Rocha';
                break;
            default: // 'basic'
                this.speed = 420;
                this.health = 2;
                this.maxHealth = 2;
                this.xpReward = 50;
                this.color = '#e74c3c';
                this.name = 'Slime Vermelho';
        }
    }

    update(snakeHead) {
        if (this.isDead) return;

        const now = Date.now();

        // Mago / Inimigo atirador
        if (this.type === 'smart' && now - this.lastShootTime > this.shootRate) {
            this.lastShootTime = now;
            this.shootAtPlayer(snakeHead);
        }

        if (now - this.lastMoveTime < this.speed) return;
        this.lastMoveTime = now;

        if (this.type === 'smart' || this.type === 'fast') {
            // Perseguir a cobra
            this.moveToward(snakeHead);
        } else {
            // Movimento aleatório com peso
            this.moveRandom();
        }
    }

    shootAtPlayer(snakeHead) {
        const myPos = grid.gridToPixels(this.gridX, this.gridY);
        const playerPos = grid.gridToPixels(snakeHead.gridX, snakeHead.gridY);

        const cx = myPos.pixelX + grid.cellSize / 2;
        const cy = myPos.pixelY + grid.cellSize / 2;
        const targetX = playerPos.pixelX + grid.cellSize / 2;
        const targetY = playerPos.pixelY + grid.cellSize / 2;

        const dx = targetX - cx;
        const dy = targetY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist > 0 && dist < 450) {
            let speed = 220;
            if (window.game && window.game.difficulty) {
                speed *= window.game.difficulty.speedMult;
            }
            const vx = (dx / dist) * speed;
            const vy = (dy / dist) * speed;
            projectilePool.spawn(cx, cy, vx, vy, false, 1, '#e74c3c', 5);
        }
    }

    moveToward(target) {
        const dx = target.gridX - this.gridX;
        const dy = target.gridY - this.gridY;

        let nextX = this.gridX;
        let nextY = this.gridY;

        if (Math.abs(dx) > Math.abs(dy)) {
            nextX += dx > 0 ? 1 : -1;
        } else {
            nextY += dy > 0 ? 1 : -1;
        }

        if (grid.isValidPosition(nextX, nextY) && !this.isObstacle(nextX, nextY)) {
            this.gridX = nextX;
            this.gridY = nextY;
        } else {
            this.moveRandom();
        }
    }

    moveRandom() {
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        // Shuffle
        directions.sort(() => Math.random() - 0.5);

        for (const dir of directions) {
            const nx = this.gridX + dir.x;
            const ny = this.gridY + dir.y;
            if (grid.isValidPosition(nx, ny) && !this.isObstacle(nx, ny)) {
                this.gridX = nx;
                this.gridY = ny;
                break;
            }
        }
    }

    isObstacle(x, y) {
        if (window.game && window.game.currentStageObject && window.game.currentStageObject.isObstacle) {
            return window.game.currentStageObject.isObstacle(x, y);
        }
        return false;
    }

    takeDamage(amount) {
        this.health -= amount;
        this.hurtUntil = Date.now() + 180;

        const pos = grid.gridToPixels(this.gridX, this.gridY);
        if (typeof particleSystem !== 'undefined') {
            particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, this.color, 8);
            particleSystem.createFloatingText(`-${amount}`, pos.pixelX + grid.cellSize / 2, pos.pixelY - 6, '#ffffff');
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        const pos = grid.gridToPixels(this.gridX, this.gridY);
        if (typeof particleSystem !== 'undefined') {
            particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, '#f39c12', 18);
        }
    }

    render(ctx) {
        if (this.isDead) return;

        const pos = grid.gridToPixels(this.gridX, this.gridY);
        const now = Date.now();

        ctx.save();
        ctx.fillStyle = (now < this.hurtUntil) ? '#ffffff' : this.color;

        // Corpo do monstro
        ctx.beginPath();
        ctx.roundRect(pos.pixelX + 3, pos.pixelY + 3, grid.cellSize - 6, grid.cellSize - 6, 5);
        ctx.fill();

        // Olhos
        ctx.fillStyle = '#000000';
        ctx.fillRect(pos.pixelX + 5, pos.pixelY + 6, 3, 3);
        ctx.fillRect(pos.pixelX + grid.cellSize - 8, pos.pixelY + 6, 3, 3);

        // Barra de Vida
        if (this.maxHealth > 1) {
            const barW = grid.cellSize - 4;
            const barH = 3;
            const barX = pos.pixelX + 2;
            const barY = pos.pixelY - 2;

            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(barX, barY, barW, barH);

            const hpRatio = Math.max(0, this.health / this.maxHealth);
            ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : (hpRatio > 0.25 ? '#f39c12' : '#e74c3c');
            ctx.fillRect(barX, barY, barW * hpRatio, barH);
        }

        ctx.restore();
    }

    getPosition() {
        return { gridX: this.gridX, gridY: this.gridY };
    }
}

class EnemyPool {
    constructor() {
        this.enemies = [];
    }

    addEnemy(gridX, gridY, type = 'basic') {
        const enemy = new Enemy(gridX, gridY, type);
        this.enemies.push(enemy);
        return enemy;
    }

    updateAll(snakeHead) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(snakeHead);
            if (enemy.isDead) {
                this.enemies.splice(i, 1);
            }
        }
    }

    renderAll(ctx) {
        this.enemies.forEach(enemy => enemy.render(ctx));
    }

    getAll() {
        return this.enemies;
    }

    clear() {
        this.enemies = [];
    }
}
