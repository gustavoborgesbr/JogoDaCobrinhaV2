/**
 * Main Game Loop
 * Orquestra todo o motor do jogo, estágios, projéteis, partículas e combate
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Resolução padrão do canvas (16:9 Widescreen)
        this.canvas.width = 960;
        this.canvas.height = 540;

        this.isRunning = false;
        this.isPaused = false;
        this.currentStage = 1;
        this.currentStageObject = null;
        this.deltaTime = 0.016;
        this.lastFrameTime = performance.now();
        this.difficulty = { speedMult: 1, spawnMult: 1 };

        // Entidades
        this.snake = null;

        // Iniciar loop de animação
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    async init() {
        console.log('🎮 Inicializando engine do Cobrinha RPG...');
        try {
            await spriteManager.init();
        } catch (e) {
            console.warn('Sprites fallback ativado:', e);
        }
        skillsSystem.init();
    }

    startStage(stageNumber = 1) {
        this.currentStage = stageNumber;
        skillsSystem.init();

        // Tocar a música tema procedural correspondente à fase
        if (typeof musicManager !== 'undefined') {
            if (stageNumber === 1) {
                musicManager.playTheme('stage1');
            } else if (stageNumber === 2) {
                musicManager.playTheme('stage2');
            } else if (stageNumber === 3) {
                musicManager.playTheme('boss');
            } else {
                musicManager.playTheme('stage1');
            }
        }

        // Criar a cobra no centro do grid
        const startX = Math.floor(grid.cols / 2);
        const startY = Math.floor(grid.rows / 2);
        this.snake = new Snake(startX, startY);

        // Limpar projéteis e partículas
        projectilePool.clear();
        particleSystem.clear();

        // Instanciar fase
        if (stageNumber === 1) {
            this.currentStageObject = new Stage1();
        } else if (stageNumber === 2) {
            this.currentStageObject = new Stage2();
        } else if (stageNumber === 3) {
            this.currentStageObject = new BossStage();
        } else {
            this.currentStageObject = new Stage1();
        }

        this.currentStageObject.init();
        this.isRunning = true;
        this.isPaused = false;

        // Ativar invencibilidade global de 5 segundos
        combatSystem.activateInvincibility(5000);

        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage(`📍 ${this.currentStageObject.name} • 🛡️ Imunidade Inicial: 5s`, 3200);
        }
    }

    update(dt) {
        if (!this.snake || !this.currentStageObject) return;

        // 1. Atualizar sistemas globais
        skillsSystem.updateAll();
        combatSystem.update();

        // 2. Atualizar cobra
        this.snake.update();

        // 3. Atualizar estágio (inimigos, itens, boss)
        this.currentStageObject.update(this.snake);

        // 4. Atualizar projéteis
        projectilePool.updateAll(dt);

        // 5. Processar colisões de combate de projéteis
        combatSystem.processProjectiles(
            projectilePool,
            this.currentStageObject.enemies,
            this.currentStageObject.boss,
            this.snake
        );

        // 6. Atualizar partículas e textos flutuantes
        particleSystem.update(dt);
    }

    render() {
        // Limpar tela com cor base
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentStageObject && this.snake) {
            // Renderizar fase (fundo, obstáculos, itens, inimigos e cobra)
            this.currentStageObject.render(this.ctx, this.snake);

            // Renderizar projéteis
            projectilePool.renderAll(this.ctx);

            // Renderizar partículas e danos flutuantes
            particleSystem.render(this.ctx);
        }
    }

    updateHUD() {
        if (this.snake && this.isRunning) {
            hud.update(this.snake);
        }
    }

    loop(currentTime) {
        const dt = Math.min(0.1, (currentTime - this.lastFrameTime) / 1000);
        this.deltaTime = dt || 0.016;
        this.lastFrameTime = currentTime;

        if (this.isRunning && !this.isPaused) {
            this.update(this.deltaTime);
            this.updateHUD();
        }

        this.render();
        requestAnimationFrame(this.loop);
    }

    pause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            menuSystem.showMenu('pause');
        } else {
            this.lastFrameTime = performance.now();
            menuSystem.showMenu(null);
        }
    }

    stageCleared(nextStage) {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.snake) {
            saveSystem.addPermanentXP(this.snake.runXP);
            menuSystem.showStageClear(this.currentStage, this.snake);
        }
    }

    gameOver() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (typeof musicManager !== 'undefined') {
            musicManager.playTheme('gameover');
        }
        if (this.snake) {
            saveSystem.addPermanentXP(this.snake.runXP);
            menuSystem.showGameOver(this.snake);
        }
    }

    victory() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (typeof musicManager !== 'undefined') {
            musicManager.playTheme('victory');
        }
        if (this.snake) {
            saveSystem.addPermanentXP(this.snake.runXP + 500);
            saveSystem.unlockNextStage(3);
            menuSystem.showVictory(this.snake);
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    window.game = new Game();
    await window.game.init();
    console.log('🐍 Cobrinha RPG pronta para a aventura!');

    // Desbloquear Web Audio no primeiro clique/interação
    const unlockAudio = () => {
        if (typeof musicManager !== 'undefined') {
            musicManager.init();
            if (!musicManager.isPlaying && musicManager.enabled) {
                musicManager.playTheme('menu');
            }
        }
        if (typeof sfx !== 'undefined') {
            sfx.init();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
});
