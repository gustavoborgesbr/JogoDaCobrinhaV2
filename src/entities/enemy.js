/**
 * Enemy
 * Inimigos que a cobra deve evitar ou derrotar
 */

class Enemy {
    constructor(gridX, gridY, type = 'basic') {
        this.gridX = gridX;
        this.gridY = gridY;
        this.type = type; // 'basic', 'fast', 'smart'
        
        this.health = 1;
        this.maxHealth = 1;
        this.speed = 200; // ms entre movimentos
        this.lastMoveTime = Date.now();
        
        this.xpReward = 50;
        this.color = '#e74c3c';
        this.isDead = false;

        this.setupByType();
    }

    setupByType() {
        switch (this.type) {
            case 'fast':
                this.speed = 100;
                this.xpReward = 100;
                this.color = '#e67e22';
                break;
            case 'smart':
                this.speed = 150;
                this.maxHealth = 2;
                this.health = 2;
                this.xpReward = 200;
                this.color = '#9b59b6';
                break;
            default: // 'basic'
                this.speed = 200;
                this.xpReward = 50;
                this.color = '#e74c3c';
        }
    }

    /**
     * Atualiza posição do inimigo
     */
    update(snakeHead) {
        if (this.isDead) return;

        const now = Date.now();
        if (now - this.lastMoveTime < this.speed) return;

        this.lastMoveTime = now;

        // TODO: Implementar diferentes IAs
        // Por enquanto, movimento aleatório
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        let moved = false;
        while (directions.length > 0 && !moved) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const newX = this.gridX + dir.x;
            const newY = this.gridY + dir.y;

            if (grid.isValidPosition(newX, newY)) {
                this.gridX = newX;
                this.gridY = newY;
                moved = true;
            }

            // Remove direção tentada
            directions.splice(directions.indexOf(dir), 1);
        }
    }

    /**
     * Toma dano
     */
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    /**
     * Morre e libera XP
     */
    die() {
        this.isDead = true;
        console.log(`💀 Inimigo derrotado! +${this.xpReward} XP`);
    }

    /**
     * Desenha o inimigo
     */
    render(ctx) {
        if (this.isDead) return;

        const pos = grid.gridToPixels(this.gridX, this.gridY);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(pos.pixelX + 2, pos.pixelY + 2, grid.cellSize - 4, grid.cellSize - 4);

        // Barra de vida (se máxHealth > 1)
        if (this.maxHealth > 1) {
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(pos.pixelX + 2, pos.pixelY + 2, grid.cellSize - 4, 2);
            
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(pos.pixelX + 2, pos.pixelY + 2, (grid.cellSize - 4) * healthPercent, 2);
        }
    }

    /**
     * Obtém posição
     */
    getPosition() {
        return { gridX: this.gridX, gridY: this.gridY };
    }
}

/**
 * Pool de inimigos
 */
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
        this.enemies.forEach(enemy => enemy.update(snakeHead));
        // Remover inimigos mortos
        this.enemies = this.enemies.filter(e => !e.isDead);
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
