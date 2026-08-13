/**
 * Boss Stage - O Chefão Final
 * Confronto final contra o chefão
 */

class BossStage {
    constructor() {
        this.name = 'O Chefão - Dragão da Magia';
        this.theme = 'boss';
        this.bgColor = '#1a0a2e';
        
        this.boss = null;
        this.items = new ItemPool();
        
        this.isStarted = false;
        this.bossDefeated = false;
    }

    /**
     * Inicia a fase do chefão
     */
    init() {
        console.log(`🐉 Fase iniciada: ${this.name}`);
        
        // Criar o chefão no centro
        const centerX = Math.floor(grid.cols / 2);
        const centerY = Math.floor(grid.rows / 2);
        
        this.boss = new Enemy(centerX, centerY, 'smart');
        this.boss.maxHealth = 10;
        this.boss.health = 10;
        this.boss.xpReward = 5000;
        this.boss.color = '#9b59b6';
        
        this.isStarted = true;
    }

    /**
     * Atualiza lógica da fase
     */
    update(snake) {
        if (!this.boss || this.boss.isDead) return;

        // Atualizar chefão
        this.boss.update(snake.getHeadPosition());

        // Atualizar itens
        this.items.updateAll();

        // Verificar colisão cobra x chefão
        if (combatSystem.checkSnakeEnemyCollision(snake, this.boss)) {
            if (combatSystem.isInvincible) {
                this.boss.takeDamage(1);
                console.log(`💥 Boss: ${this.boss.health}/${this.boss.maxHealth} HP`);
            } else {
                snake.takeDamage(1);
            }
        }

        // Verificar colisões cobra x itens
        this.items.getAll().forEach(item => {
            if (combatSystem.checkSnakeItemCollision(snake, item)) {
                combatSystem.resolveSnakeItemCollision(snake, item);
            }
        });

        // Verificar se chefão foi derrotado
        if (this.boss.isDead) {
            this.bossDefeated = true;
            console.log('🎉 Chefão Derrotado! Jogo Vencido!');
            snake.gainXP(this.boss.xpReward);
            
            if (window.game) {
                window.game.isRunning = false;
                // TODO: Mostrar tela de vitória
            }
        }
    }

    /**
     * Desenha a fase
     */
    render(ctx, snake) {
        // Fundo especial
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, grid.width, grid.height);

        // Efeito de aura ao redor do chefão
        if (this.boss && !this.boss.isDead) {
            const bossPos = grid.gridToPixels(this.boss.gridX, this.boss.gridY);
            ctx.strokeStyle = 'rgba(155, 89, 182, 0.3)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(
                bossPos.pixelX + grid.cellSize / 2,
                bossPos.pixelY + grid.cellSize / 2,
                grid.cellSize * 3,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }

        // Renderizar itens
        this.items.renderAll(ctx);

        // Renderizar chefão
        if (this.boss) this.boss.render(ctx);

        // Renderizar cobra
        snake.render(ctx);
    }

    /**
     * Limpa recursos da fase
     */
    cleanup() {
        this.boss = null;
        this.items.clear();
    }
}
