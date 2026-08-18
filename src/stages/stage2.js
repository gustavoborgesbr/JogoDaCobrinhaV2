/**
 * Stage 2 - A Caverna Cristalina
 * Segunda fase com labirinto de pedras e inimigos avançados
 */

class Stage2 {
    constructor() {
        this.name = 'A Caverna Cristalina';
        this.theme = 'cave';
        this.bgColor = '#14142b';
        this.accentColor = '#1f1f3d';

        this.enemies = new EnemyPool();
        this.items = new ItemPool();

        let baseSpawnRate = 2600;
        if (window.game && window.game.difficulty) {
            baseSpawnRate = baseSpawnRate / window.game.difficulty.spawnMult;
        }

        this.enemySpawnRate = baseSpawnRate;
        this.lastSpawnTime = Date.now();
        this.itemSpawnRate = 3500;
        this.lastItemSpawnTime = Date.now();

        this.targetItems = 12;
        this.targetEnemies = 12;

        this.obstacles = [];
        this.generateObstacles();

        this.portalSpawned = false;
        this.portal = null;
    }

    generateObstacles() {
        this.obstacles = [];

        // Paredes de rocha formando corredores
        for (let x = 6; x <= 14; x++) this.obstacles.push({ gridX: x, gridY: 8 });
        for (let x = 26; x <= 34; x++) this.obstacles.push({ gridX: x, gridY: 8 });
        for (let x = 6; x <= 14; x++) this.obstacles.push({ gridX: x, gridY: 22 });
        for (let x = 26; x <= 34; x++) this.obstacles.push({ gridX: x, gridY: 22 });

        // Pilares centrais
        for (let y = 11; y <= 19; y++) {
            this.obstacles.push({ gridX: 13, gridY: y });
            this.obstacles.push({ gridX: 27, gridY: y });
        }
    }

    init() {
        console.log(`⛏️ Fase iniciada: ${this.name}`);
        this.enemies.clear();
        this.items.clear();

        for (let i = 0; i < 6; i++) {
            this.spawnSafeItem();
        }
        for (let i = 0; i < 4; i++) {
            this.spawnEnemy();
        }
    }

    isObstacle(x, y) {
        return this.obstacles.some(obs => obs.gridX === x && obs.gridY === y);
    }

    spawnSafeItem() {
        let pos;
        let tries = 0;
        do {
            pos = grid.randomPosition();
            tries++;
        } while (this.isObstacle(pos.gridX, pos.gridY) && tries < 30);

        this.items.spawnRandomItem(pos.gridX, pos.gridY);
    }

    spawnPortal() {
        this.portalSpawned = true;
        this.portal = { gridX: Math.floor(grid.cols / 2), gridY: Math.floor(grid.rows / 2) };
        
        const p = grid.gridToPixels(this.portal.gridX, this.portal.gridY);
        if (typeof particleSystem !== 'undefined') {
            particleSystem.createExplosion(p.pixelX, p.pixelY, '#38bdf8', 40);
        }
        
        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage('✨ O Portal de Cristal se abriu!', 3000);
        }
        if (typeof sfx !== 'undefined' && sfx.playLevelUp) {
            sfx.playLevelUp();
        }
    }

    spawnEnemy() {
        let pos;
        let tries = 0;
        const centerX = Math.floor(grid.cols / 2);
        const centerY = Math.floor(grid.rows / 2);
        do {
            pos = grid.randomPosition();
            tries++;
            const distFromCenter = Math.hypot(pos.gridX - centerX, pos.gridY - centerY);
            if (!this.isObstacle(pos.gridX, pos.gridY) && distFromCenter >= 9) {
                break;
            }
        } while (tries < 35);

        const rand = Math.random();
        let type = 'basic';
        if (rand < 0.35) type = 'fast';
        else if (rand < 0.7) type = 'smart';
        else type = 'tank';

        this.enemies.addEnemy(pos.gridX, pos.gridY, type);
    }

    update(snake) {
        const now = Date.now();

        if (now - this.lastSpawnTime > this.enemySpawnRate && this.enemies.getAll().length < 8) {
            this.spawnEnemy();
            this.lastSpawnTime = now;
        }

        if (now - this.lastItemSpawnTime > this.itemSpawnRate && this.items.getAll().length < 10) {
            this.spawnSafeItem();
            this.lastItemSpawnTime = now;
        }

        this.enemies.updateAll(snake.getHeadPosition());
        this.items.updateAll(snake);

        const head = snake.getHeadPosition();
        this.enemies.getAll().forEach(enemy => {
            if (enemy.gridX === head.gridX && enemy.gridY === head.gridY) {
                combatSystem.resolveSnakeEnemyCollision(snake, enemy);
            }
        });

        this.items.getAll().forEach(item => {
            if (item.gridX === head.gridX && item.gridY === head.gridY) {
                combatSystem.resolveSnakeItemCollision(snake, item);
            }
        });

        if (!this.portalSpawned && snake.itemsCollected >= this.targetItems && snake.enemiesDefeated >= this.targetEnemies) {
            this.spawnPortal();
        }

        if (this.portalSpawned) {
            if (head.gridX === this.portal.gridX && head.gridY === this.portal.gridY) {
                saveSystem.unlockNextStage(3);
                if (window.game) window.game.stageCleared(3);
            }
        }
    }

    getGoalText(snake) {
        return '';
    }

    render(ctx, snake) {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, grid.width, grid.height);

        // Grade temática translúcida
        ctx.fillStyle = 'rgba(15, 30, 55, 0.28)';
        for (let x = 0; x < grid.cols; x += 3) {
            for (let y = 0; y < grid.rows; y += 3) {
                ctx.fillRect(x * grid.cellSize, y * grid.cellSize, grid.cellSize, grid.cellSize);
            }
        }

        // Renderizar rochas e cristais
        ctx.fillStyle = '#47476b';
        this.obstacles.forEach(obs => {
            const p = grid.gridToPixels(obs.gridX, obs.gridY);
            ctx.beginPath();
            ctx.roundRect(p.pixelX + 1, p.pixelY + 1, grid.cellSize - 2, grid.cellSize - 2, 4);
            ctx.fill();

            // Cristais roxos brilhando
            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(p.pixelX + 6, p.pixelY + 6, grid.cellSize - 12, grid.cellSize - 12);
            ctx.fillStyle = '#47476b';
        });

        this.items.renderAll(ctx);
        this.enemies.renderAll(ctx);

        if (this.portalSpawned && this.portal) {
            const p = grid.gridToPixels(this.portal.gridX, this.portal.gridY);
            const cx = p.pixelX + grid.cellSize / 2;
            const cy = p.pixelY + grid.cellSize / 2;
            const now = Date.now();
            
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(now / 300); // Rotação do vórtice
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, grid.cellSize * 1.5);
            gradient.addColorStop(0, 'rgba(125, 211, 252, 0.9)');
            gradient.addColorStop(0.5, 'rgba(2, 132, 199, 0.7)');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, grid.cellSize * 1.5 + Math.sin(now / 150) * 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, grid.cellSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Seta indicadora (Bússola) se o portal estiver muito longe
            const headP = grid.gridToPixels(snake.getHeadPosition().gridX, snake.getHeadPosition().gridY);
            const dist = Math.hypot(headP.pixelX - cx, headP.pixelY - cy);
            if (dist > 150) {
                const angle = Math.atan2(cy - headP.pixelY, cx - headP.pixelX);
                ctx.save();
                ctx.translate(headP.pixelX + grid.cellSize/2 + Math.cos(angle) * 45, headP.pixelY + grid.cellSize/2 + Math.sin(angle) * 45);
                ctx.rotate(angle);
                ctx.fillStyle = '#7dd3fc';
                ctx.shadowColor = '#0284c7';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(12, 0);
                ctx.lineTo(-6, 8);
                ctx.lineTo(-6, -8);
                ctx.fill();
                ctx.restore();
            }
        }

        snake.render(ctx);
    }

    cleanup() {
        this.enemies.clear();
        this.items.clear();
    }
}
