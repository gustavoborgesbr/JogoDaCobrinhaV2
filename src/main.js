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
        this.deltaTime = 0;
        this.lastFrameTime = Date.now();

        // Inicializar sistemas
        this.init();
    }

    init() {
        console.log('🎮 Inicializando jogo...');
        
        // TODO: Inicializar todos os sistemas
        // - Grid system
        // - Input handler
        // - Snake
        // - Enemies
        // - Items
        // - XP/Levels
        // - Skills
        // - Save system

        console.log('✅ Jogo inicializado!');
    }

    update() {
        // TODO: Atualizar lógica do jogo a cada frame
        // 1. Processar input
        // 2. Atualizar posições
        // 3. Resolver colisões
        // 4. Atualizar sistemas de XP, skills, etc
    }

    render() {
        // Limpar canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // TODO: Desenhar tudo
        // - Grid
        // - Cobra
        // - Inimigos
        // - Itens
        // - Efeitos
    }

    updateHUD() {
        // TODO: Atualizar informações de XP, vida, nível, etc
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
        // TODO: Mostrar tela de game over
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
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    window.game.start();
});
