/**
 * Stage 1 - A Floresta
 * Primeira fase temática
 */

class Stage1 {
    constructor() {
        this.name = 'A Floresta';
        this.theme = 'forest';
        this.bgColor = '#0d3d0d';
        
        this.enemies = new EnemyPool();
        this.items = new ItemPool();
        
        this.enemySpawnRate = 3000;  // ms entre spawns
        this.lastSpawnTime = Date.now();
        
        this.waveNumber = 1;
        this.enemiesDefeated = 0;
        this.targetEnemies = 10;
    }

    /**
     * Inicia a fase
     */
    init() {
        console.log(`🌲 Fase iniciada: ${this.name}`);
        
        // Spawnar inimigos iniciais
        for (let i = 0; i < 3; i++) {
            const pos = grid.randomPosition();
            this.enemies.addEnemy(pos.gridX, pos.gridY, 'basic');
        }
    }

    /**
     * Atualiza lógica da fase
     */
    update(snake) {
        // Spawnar novos inimigos
        const now = Date.now();
        if (now - this.lastSpawnTime > this.enemySpawnRate) {
            this.spawnEnemy();
            this.lastSpawnTime = now;
        }

        // Atualizar inimigos
        this.enemies.updateAll(snake.getHeadPosition());

        // Atualizar itens
        this.items.updateAll();

        // Verificar colisões cobra x inimigos
        this.enemies.getAll().forEach(enemy => {
            if (combatSystem.checkSnakeEnemyCollision(snake, enemy)) {
                combatSystem.resolveSnakeEnemyCollision(snake, enemy);
                if (enemy.isDead) this.enemiesDefeated++;
            }
        });

        // Verificar colisões cobra x itens
        this.items.getAll().forEach(item => {
            if (combatSystem.checkSnakeItemCollision(snake, item)) {
                combatSystem.resolveSnakeItemCollision(snake, item);
                
                // Drop XP onde item foi coletado
                if (item.type === 'xp') {
                    this.items.spawnRandomItem(item.gridX, item.gridY);
                }
            }
        });

        // Verificar se fase terminou
        if (this.enemiesDefeated >= this.targetEnemies && this.enemies.getAll().length === 0) {
            console.log('✅ Fase 1 Concluída!');
            if (window.game) window.game.nextStage();
        }
    }

    /**
     * Spawna um novo inimigo
     */
    spawnEnemy() {
        let type = 'basic';
        if (Math.random() < 0.2) type = 'fast';
        
        const pos = grid.randomPosition();
        this.enemies.addEnemy(pos.gridX, pos.gridY, type);
    }

    /**
     * Desenha a fase
     */
    render(ctx, snake) {
        // Fundo
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, grid.width, grid.height);

        // Grid (opcional - para debug)
        // this.renderGrid(ctx);

        // Renderizar itens
        this.items.renderAll(ctx);

        // Renderizar inimigos
        this.enemies.renderAll(ctx);

        // Renderizar cobra
        snake.render(ctx);
    }

    /**
     * Desenha grid de coordenadas (para debug)
     */
    renderGrid(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= grid.cols; x++) {
            const pixelX = x * grid.cellSize;
            ctx.beginPath();
            ctx.moveTo(pixelX, 0);
            ctx.lineTo(pixelX, grid.height);
            ctx.stroke();
        }

        for (let y = 0; y <= grid.rows; y++) {
            const pixelY = y * grid.cellSize;
            ctx.beginPath();
            ctx.moveTo(0, pixelY);
            ctx.lineTo(grid.width, pixelY);
            ctx.stroke();
        }
    }

    /**
     * Limpa recursos da fase
     */
    cleanup() {
        this.enemies.clear();
        this.items.clear();
    }
}
