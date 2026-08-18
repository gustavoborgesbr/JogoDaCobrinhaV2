/**
 * Stage 1 - A Floresta Encantada
 * Primeira fase temática
 */

class Stage1 {
    constructor() {
        this.name = 'A Floresta Encantada';
        this.theme = 'forest';
        this.bgColor = '#0d2818';
        this.accentColor = '#1b4332';

        this.enemies = new EnemyPool();
        this.items = new ItemPool();

        let baseSpawnRate = 3200;
        if (window.game && window.game.difficulty) {
            baseSpawnRate = baseSpawnRate / window.game.difficulty.spawnMult;
        }

        this.enemySpawnRate = baseSpawnRate;
        this.lastSpawnTime = Date.now();
        this.itemSpawnRate = 4000;
        this.lastItemSpawnTime = Date.now();

        this.targetItems = 8;
        this.targetEnemies = 8;

        this.obstacles = [
            // Árvores / Troncos no cenário
            { gridX: 8, gridY: 7 },
            { gridX: 9, gridY: 7 },
            { gridX: 30, gridY: 7 },
            { gridX: 31, gridY: 7 },
            { gridX: 8, gridY: 22 },
            { gridX: 9, gridY: 22 },
            { gridX: 30, gridY: 22 },
            { gridX: 31, gridY: 22 },
            { gridX: 19, gridY: 14 },
            { gridX: 20, gridY: 14 },
            { gridX: 21, gridY: 14 }
        ];

        this.portalSpawned = false;
        this.portal = null;
    }

    init() {
        console.log(`🌲 Fase iniciada: ${this.name}`);
        this.enemies.clear();
        this.items.clear();

        // Spawn inicial de itens
        for (let i = 0; i < 5; i++) {
            this.spawnSafeItem();
        }

        // Spawn inicial de inimigos
        for (let i = 0; i < 3; i++) {
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
        } while (this.isObstacle(pos.gridX, pos.gridY) && tries < 20);

        this.items.spawnRandomItem(pos.gridX, pos.gridY);
    }

    spawnPortal() {
        this.portalSpawned = true;
        // Posição central livre ou aproximada
        this.portal = { gridX: Math.floor(grid.cols / 2), gridY: Math.floor(grid.rows / 2) };
        
        const p = grid.gridToPixels(this.portal.gridX, this.portal.gridY);
        if (typeof particleSystem !== 'undefined') {
            particleSystem.createExplosion(p.pixelX, p.pixelY, '#a855f7', 40);
        }
        
        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage('✨ O Portal da Floresta se abriu!', 3000);
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
        } while (tries < 30);

        const type = Math.random() < 0.3 ? 'fast' : 'basic';
        this.enemies.addEnemy(pos.gridX, pos.gridY, type);
    }

    update(snake) {
        const now = Date.now();

        // Spawns periódicos
        if (now - this.lastSpawnTime > this.enemySpawnRate && this.enemies.getAll().length < 6) {
            this.spawnEnemy();
            this.lastSpawnTime = now;
        }

        if (now - this.lastItemSpawnTime > this.itemSpawnRate && this.items.getAll().length < 8) {
            this.spawnSafeItem();
            this.lastItemSpawnTime = now;
        }

        // Atualizar entidades
        this.enemies.updateAll(snake.getHeadPosition());
        this.items.updateAll(snake);

        // Checar colisões cobra x inimigos
        const head = snake.getHeadPosition();
        this.enemies.getAll().forEach(enemy => {
            if (enemy.gridX === head.gridX && enemy.gridY === head.gridY) {
                combatSystem.resolveSnakeEnemyCollision(snake, enemy);
            }
        });

        // Checar colisões cobra x itens
        this.items.getAll().forEach(item => {
            if (item.gridX === head.gridX && item.gridY === head.gridY) {
                combatSystem.resolveSnakeItemCollision(snake, item);
            }
        });

        // Verificar condição de vitória da Fase 1
        if (!this.portalSpawned && snake.itemsCollected >= this.targetItems && snake.enemiesDefeated >= this.targetEnemies) {
            this.spawnPortal();
        }

        if (this.portalSpawned) {
            if (head.gridX === this.portal.gridX && head.gridY === this.portal.gridY) {
                saveSystem.unlockNextStage(2);
                if (window.game) window.game.stageCleared(2);
            }
        }
    }

    getGoalText(snake) {
        // Agora usaremos o novo formato visual no hud.js
        return ''; 
    }

    render(ctx, snake) {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, grid.width, grid.height);

        // Padrão de grade quadriculada suave e translúcida
        ctx.fillStyle = 'rgba(27, 67, 50, 0.25)';
        for (let x = 0; x < grid.cols; x += 2) {
            for (let y = 0; y < grid.rows; y += 2) {
                ctx.fillRect(x * grid.cellSize, y * grid.cellSize, grid.cellSize, grid.cellSize);
            }
        }

        // Renderizar árvores / obstáculos
        ctx.fillStyle = '#2d6a4f';
        this.obstacles.forEach(obs => {
            const p = grid.gridToPixels(obs.gridX, obs.gridY);
            ctx.beginPath();
            ctx.roundRect(p.pixelX + 1, p.pixelY + 1, grid.cellSize - 2, grid.cellSize - 2, 4);
            ctx.fill();

            // Detalhe de folhagem
            ctx.fillStyle = '#40916c';
            ctx.fillRect(p.pixelX + 4, p.pixelY + 4, grid.cellSize - 8, grid.cellSize - 8);
            ctx.fillStyle = '#2d6a4f';
        });

        // Renderizar itens e inimigos
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
            gradient.addColorStop(0, 'rgba(216, 180, 254, 0.9)');
            gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.7)');
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
                ctx.fillStyle = '#d8b4fe';
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(12, 0);
                ctx.lineTo(-6, 8);
                ctx.lineTo(-6, -8);
                ctx.fill();
                ctx.restore();
            }
        }

        // Renderizar cobra
        snake.render(ctx);
    }

    cleanup() {
        this.enemies.clear();
        this.items.clear();
    }
}
