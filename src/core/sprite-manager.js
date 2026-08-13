/**
 * Sprite Manager
 * Gerencia carregamento e renderização de sprites
 */

class SpriteManager {
    constructor() {
        this.sprites = {};
        this.spriteSheet = null;
        this.isLoaded = false;

        // Dimensões dos sprites na sheet
        this.SPRITE_WIDTH = 40;
        this.SPRITE_HEIGHT = 40;

        // Mapa de posições dos sprites na sheet
        // Formato: { directionAndFrame: { x, y } }
        this.spriteMap = {
            // Movimento CIMA (up) - 5 frames
            'up_0': { x: 311, y: 97 },
            'up_1': { x: 483, y: 97 },
            'up_2': { x: 655, y: 97 },
            'up_3': { x: 827, y: 97 },
            'up_4': { x: 1094, y: 97 },

            // Movimento BAIXO (down) - 5 frames
            'down_0': { x: 277, y: 270 },
            'down_1': { x: 483, y: 270 },
            'down_2': { x: 655, y: 270 },
            'down_3': { x: 827, y: 270 },
            'down_4': { x: 1094, y: 270 },

            // Movimento ESQUERDA (left) - 4 frames
            'left_0': { x: 277, y: 420 },
            'left_1': { x: 483, y: 420 },
            'left_2': { x: 655, y: 420 },
            'left_3': { x: 827, y: 420 },

            // Movimento DIREITA (right) - 4 frames
            'right_0': { x: 277, y: 560 },
            'right_1': { x: 483, y: 560 },
            'right_2': { x: 655, y: 560 },
            'right_3': { x: 827, y: 560 },

            // Cabeça estática
            'head_up': { x: 100, y: 740 },
            'head_down': { x: 277, y: 740 },
            'head_left': { x: 453, y: 740 },
            'head_right': { x: 629, y: 740 },

            // Corpo (segmentos)
            'body_straight': { x: 102, y: 795 },
            'body_curve_left': { x: 233, y: 795 },
            'body_curve_right': { x: 364, y: 795 },
            'body_tail': { x: 495, y: 795 }
        };

        this.init();
    }

    /**
     * Inicializa e carrega a sprite sheet
     */
    async init() {
        return new Promise((resolve) => {
            this.spriteSheet = new Image();
            this.spriteSheet.onload = () => {
                this.isLoaded = true;
                console.log('✅ Sprite Sheet carregado!');
                resolve();
            };
            this.spriteSheet.onerror = () => {
                console.error('❌ Erro ao carregar sprite sheet');
                resolve();
            };
            this.spriteSheet.src = 'assets/sprites/cobra-sprites.png';
        });
    }

    /**
     * Desenha um frame específico da sprite sheet
     */
    drawSprite(ctx, spriteKey, x, y, width = 20, height = 20) {
        if (!this.isLoaded || !this.spriteSheet) return;

        const sprite = this.spriteMap[spriteKey];
        if (!sprite) {
            console.warn(`Sprite não encontrado: ${spriteKey}`);
            return;
        }

        ctx.drawImage(
            this.spriteSheet,
            sprite.x,
            sprite.y,
            this.SPRITE_WIDTH,
            this.SPRITE_HEIGHT,
            x,
            y,
            width,
            height
        );
    }

    /**
     * Retorna a chave de sprite para uma direção
     */
    getMovementSpriteKey(direction, frameIndex) {
        let dirName = 'right';

        if (direction.x === 0 && direction.y === -1) {
            dirName = 'up';
            frameIndex = Math.min(frameIndex, 4);
        } else if (direction.x === 0 && direction.y === 1) {
            dirName = 'down';
            frameIndex = Math.min(frameIndex, 4);
        } else if (direction.x === -1) {
            dirName = 'left';
            frameIndex = Math.min(frameIndex, 3);
        } else if (direction.x === 1) {
            dirName = 'right';
            frameIndex = Math.min(frameIndex, 3);
        }

        return `${dirName}_${frameIndex}`;
    }

    /**
     * Retorna sprite de cabeça para uma direção
     */
    getHeadSpriteKey(direction) {
        if (direction.x === 0 && direction.y === -1) return 'head_up';
        if (direction.x === 0 && direction.y === 1) return 'head_down';
        if (direction.x === -1) return 'head_left';
        if (direction.x === 1) return 'head_right';
        return 'head_right';
    }

    /**
     * Retorna sprite de corpo
     */
    getBodySpriteKey(segmentType = 'straight') {
        return `body_${segmentType}`;
    }
}

// Criar instância global
const spriteManager = new SpriteManager();
