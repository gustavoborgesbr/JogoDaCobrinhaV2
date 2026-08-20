/**
 * Input Handler
 * Gerencia teclado, filas de direção e atalhos de habilidades (Q, W, E, R)
 * Inclui suporte a toque/mobile (swipe e botões virtuais)
 */

class InputHandler {
    constructor() {
        this.keys = {};
        this.directionQueue = [];
        this.lastDirection = { x: 1, y: 0 };
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Touch listeners no canvas
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        }
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        this.keys[key] = true;

        // Menu shortcuts (Cutscene / Game Over / Stage Clear / Pause)
        if (typeof menuSystem !== 'undefined' && menuSystem.currentMenu) {
            if (menuSystem.currentMenu === 'cutscene') {
                if (key === 'escape' || key === ' ' || key === 'enter') {
                    menuSystem.skipCutscene();
                    return;
                }
            } else if (key === 'enter' || key === ' ') {
                if (menuSystem.currentMenu === 'gameover') {
                    menuSystem.restartStage();
                    return;
                } else if (menuSystem.currentMenu === 'stageclear') {
                    menuSystem.startNextStage();
                    return;
                }
            } else if (key === 'escape') {
                if (menuSystem.currentMenu === 'pause') {
                    menuSystem.resumeGame();
                    return;
                } else if (menuSystem.currentMenu !== 'main') {
                    menuSystem.showMenu('main');
                    return;
                }
            }
        }

        // Movimentação (Setas ou WASD)
        if (key === 'arrowup' || key === 'w') {
            this.queueDirection(0, -1);
        } else if (key === 'arrowdown' || key === 's') {
            this.queueDirection(0, 1);
        } else if (key === 'arrowleft' || key === 'a') {
            this.queueDirection(-1, 0);
        } else if (key === 'arrowright' || key === 'd') {
            this.queueDirection(1, 0);
        }

        // Habilidades com teclas dedicadas (Q: Tiro, W/Shift: Dash, E: Escudo, R: Magnetismo, T/Espaço: Devorar)
        if (key === 'q' || key === '1') {
            this.triggerSkill('shoot');
        } else if (key === 'e' || key === '2') {
            this.triggerSkill('shield');
        } else if (key === 'r' || key === '3') {
            this.triggerSkill('magnet');
        } else if (key === 't' || key === '4' || key === 'v' || key === ' ') {
            // Tecla T, 4, V ou Barra de Espaço ativam a Fauce Devoradora
            this.triggerSkill('devour');
        } else if (key === 'shift') {
            // Shift ativa o Dash
            this.triggerSkill('dash');
        } else if (key === 'f') {
            // Tecla F alterna Tela Cheia no PC
            if (typeof menuSystem !== 'undefined') menuSystem.toggleFullscreen();
        } else if (key === 'm') {
            // Tecla M alterna Música (Mudo/Ligado)
            if (typeof menuSystem !== 'undefined') menuSystem.toggleMusic();
        } else if (key === 'p' || key === 'escape') {
            if (window.game) window.game.pause();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    queueDirection(x, y) {
        // Evita enfileirar direções redundantes
        const lastQueued = this.directionQueue.length > 0 
            ? this.directionQueue[this.directionQueue.length - 1] 
            : this.lastDirection;

        if (lastQueued.x !== x || lastQueued.y !== y) {
            if (this.directionQueue.length < 3) {
                this.directionQueue.push({ x, y });
            }
        }
    }

    getNextDirection() {
        while (this.directionQueue.length > 0) {
            const dir = this.directionQueue.shift();
            // Não permitir inverter 180 graus na mesma linha
            if (dir.x !== -this.lastDirection.x || dir.y !== -this.lastDirection.y) {
                this.lastDirection = dir;
                return dir;
            }
        }
        return this.lastDirection;
    }

    triggerSkill(skillName) {
        if (window.game && window.game.snake && window.game.isRunning && !window.game.isPaused) {
            skillsSystem.activateSkill(skillName, window.game.snake);
        }
    }

    handleTouchStart(e) {
        if (!e.touches || e.touches.length === 0) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const deltaX = e.changedTouches[0].clientX - this.touchStartX;
        const deltaY = e.changedTouches[0].clientY - this.touchStartY;
        const minSwipe = 25;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipe) {
                if (deltaX > 0) this.queueDirection(1, 0); // Direita
                else this.queueDirection(-1, 0);            // Esquerda
            }
        } else {
            if (Math.abs(deltaY) > minSwipe) {
                if (deltaY > 0) this.queueDirection(0, 1);  // Baixo
                else this.queueDirection(0, -1);           // Cima
            }
        }
    }

    isKeyPressed(key) {
        return !!this.keys[key.toLowerCase()];
    }
}

const input = new InputHandler();
