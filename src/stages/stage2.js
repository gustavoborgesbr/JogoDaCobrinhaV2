/**
 * Stage 2 - A Caverna
 * Segunda fase temática
 */

class Stage2 {
    constructor() {
        this.name = 'A Caverna';
        this.theme = 'cave';
        this.bgColor = '#2a2a3a';
        
        this.enemies = new EnemyPool();
        this.items = new ItemPool();
        
        this.enemySpawnRate = 2500; // Mais rápido que stage 1
        this.lastSpawnTime = Date.now();
        
        this.waveNumber = 1;
        this.enemiesDefeated = 0;
        this.targetEnemies = 20; // Mais inimigos
        
        this.obstacles = [];
    }

    /**
     * Inicia a fase
     */
    init() {
        console.log(`⛏️ Fase iniciada: ${this.name}`);
        
        // Gerar obstáculos
        this.generateObstacles();
        
        // Spawnar inimigos iniciais
        for (let i = 0; i < 4; i++) {
            const pos = grid.randomPosition();
            const type = Math.random() < 0.3 ? 'fast' : 'basic';
            this.enemies.addEnemy(pos.gridX, pos.gridY, type);
        }
    }

    /**
     * Gera obstáculos para a caverna
     */
    generateObstacles() {
        // TODO: Implementar obstáculos que bloqueiam movimento
        // Por enquanto, apenas um placeholder
        this.obstacles = [];
    }

    /**
     * Verifica colisão com obstáculo
     */
    isObstaclePath(gridX, gridY) {
        // TODO: Verificar se posição colide com obstáculo
        return false;
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
            }
        });

        // Verificar se fase terminou
        if (this.enemiesDefeated >= this.targetEnemies && this.enemies.getAll().length === 0) {
            console.log('✅ Fase 2 Concluída!');
            if (window.game) window.game.nextStage();
        }
    }

    /**
     * Spawna um novo inimigo com variedade aumentada
     */
    spawnEnemy() {
        let type = 'basic';
        const rand = Math.random();
        if (rand < 0.3) type = 'fast';
        else if (rand < 0.5) type = 'smart';
        
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

        // Renderizar obstáculos
        this.renderObstacles(ctx);

        // Renderizar itens
        this.items.renderAll(ctx);

        // Renderizar inimigos
        this.enemies.renderAll(ctx);

        // Renderizar cobra
        snake.render(ctx);
    }

    /**
     * Desenha obstáculos
     */
    renderObstacles(ctx) {
        ctx.fillStyle = '#555';
        this.obstacles.forEach(obs => {
            const pos = grid.gridToPixels(obs.gridX, obs.gridY);
            ctx.fillRect(pos.pixelX, pos.pixelY, grid.cellSize, grid.cellSize);
        });
    }

    /**
     * Limpa recursos da fase
     */
    cleanup() {
        this.enemies.clear();
        this.items.clear();
        this.obstacles = [];
    }
}
