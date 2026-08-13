/**
 * Input Handler
 * Gerencia entrada de teclado
 */

class InputHandler {
    constructor() {
        this.keys = {};
        this.directionQueue = [];
        this.lastDirection = { x: 1, y: 0 }; // Começa indo para a direita

        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;

        // Filas de direção (para input buffer)
        switch (e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                this.directionQueue.push({ x: 0, y: -1 });
                break;
            case 'arrowdown':
            case 's':
                this.directionQueue.push({ x: 0, y: 1 });
                break;
            case 'arrowleft':
            case 'a':
                this.directionQueue.push({ x: -1, y: 0 });
                break;
            case 'arrowright':
            case 'd':
                this.directionQueue.push({ x: 1, y: 0 });
                break;
            case ' ':
                // Espaço para skill/ação especial
                this.activateSkill();
                break;
            case 'p':
                // P para pausar
                if (window.game) window.game.pause();
                break;
        }
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    /**
     * Retorna a próxima direção da fila (sem repetir a anterior)
     */
    getNextDirection() {
        while (this.directionQueue.length > 0) {
            const dir = this.directionQueue.shift();
            // Não permitir inverter para trás
            if (dir.x !== -this.lastDirection.x || dir.y !== -this.lastDirection.y) {
                this.lastDirection = dir;
                return dir;
            }
        }
        return this.lastDirection;
    }

    /**
     * Placeholder para ativar skill
     */
    activateSkill() {
        console.log('⚡ Skill ativada!');
        // TODO: Chamar sistema de skills
    }

    /**
     * Verifica se tecla está pressionada
     */
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }
}

// Criar instância global
const input = new InputHandler();
