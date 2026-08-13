/**
 * Main Game Loop
 * Orquestra toda a lógica do jogo
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Ajustar resolução do canvas
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.isRunning = false;
        this.isPaused = false;
        this.currentStage = 1;
        this.currentStageObject = null;
        this.deltaTime = 0;
        this.lastFrameTime = Date.now();

        // Entidades
        this.snake = null;

        // Inicializar sistemas
        this.init();
    }

    async init() {
        console.log('🎮 Inicializando jogo...');
        
        // Aguardar carregamento de sprites
        await spriteManager.init();
        
        // Inicializar cobra no centro do grid
        const startX = Math.floor(grid.cols / 2);
        const startY = Math.floor(grid.rows / 2);
        this.snake = new Snake(startX, startY);

        console.log('✅ Jogo inicializado!');
    }

    update() {
        if (!this.snake) return;

        // TODO: Atualizar lógica do jogo a cada frame
        // 1. Processar input
        this.snake.update();
        
        // 2. Atualizar posições (já feito no snake.update)
        
        // 3. Resolver colisões
        // TODO: Integrar com stage e sistema de combate
        
        // 4. Atualizar sistemas de XP, skills, etc
        skillsSystem.updateAll();
        combatSystem.update();
    }

    render() {
        // Limpar canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenhar grid (opcional - para debug, comentado por padrão)
        // this.renderGrid();

        // Renderizar cobra
        if (this.snake) {
            this.snake.render(this.ctx);
        }

        // TODO: Renderizar inimigos, itens, efeitos quando integrar com stage
    }

    /**
     * Renderiza grid de coordenadas (debug)
     */
    renderGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= grid.cols; x++) {
            const pixelX = x * grid.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pixelX, 0);
            this.ctx.lineTo(pixelX, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= grid.rows; y++) {
            const pixelY = y * grid.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, pixelY);
            this.ctx.lineTo(this.canvas.width, pixelY);
            this.ctx.stroke();
        }
    }

    updateHUD() {
        if (this.snake) {
            hud.update(this.snake);
        }
    }

    gameLoop() {
        if (!this.isRunning) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }

        const now = Date.now();
        this.deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        if (!this.isPaused) {
            this.update();
        }

        this.render();
        this.updateHUD();

        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
        console.log('▶️ Jogo iniciado!');
    }

    pause() {
        this.isPaused = !this.isPaused;
        console.log(this.isPaused ? '⏸️ Pausado' : '▶️ Retomado');
    }

    gameOver() {
        this.isRunning = false;
        console.log('💀 Game Over!');
        if (this.snake) {
            menuSystem.showGameOver(this.snake);
        }
    }

    levelUp() {
        console.log('⭐ Level Up!');
        // TODO: Feedback visual/áudio
    }

    nextStage() {
        this.currentStage++;
        console.log(`📍 Avançando para fase ${this.currentStage}`);
        // TODO: Carregar próxima fase
    }
}

// Inicializar jogo quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    // Criar instância do jogo
    window.game = new Game();
    
    // Aguardar inicialização (carregamento de sprites)
    await window.game.init();
    
    console.log('🎮 Sistema pronto para jogar!');
});
