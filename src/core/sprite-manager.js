/**
 * Sprite Manager
 * Gerencia carregamento, mapeamento de coordenadas e renderização de sprites.
 */
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.spriteSheet = null;
        this.isLoaded = false;

        // Dimensões padrão para fallback caso w ou h não sejam definidos no mapa
        this.DEFAULT_WIDTH = 40;
        this.DEFAULT_HEIGHT = 40;

        // Mapa de posições e dimensões dos sprites na sheet (x, y, w, h)
        this.spriteMap = {
            // Movimento CIMA (up) - 5 frames
            'up_0': { x: 311, y: 97, w: 40, h: 60 },
            'up_1': { x: 483, y: 97, w: 40, h: 60 },
            'up_2': { x: 655, y: 97, w: 40, h: 60 },
            'up_3': { x: 827, y: 97, w: 50, h: 60 },
            'up_4': { x: 1094, y: 97, w: 60, h: 60 },

            // Movimento BAIXO (down) - 5 frames
            'down_0': { x: 277, y: 270, w: 40, h: 60 },
            'down_1': { x: 483, y: 270, w: 40, h: 60 },
            'down_2': { x: 655, y: 270, w: 40, h: 60 },
            'down_3': { x: 827, y: 270, w: 50, h: 60 },
            'down_4': { x: 1094, y: 270, w: 60, h: 60 },

            // Movimento ESQUERDA (left) - 4 frames (sprites mais compridos)
            'left_0': { x: 277, y: 420, w: 120, h: 35 },
            'left_1': { x: 483, y: 420, w: 120, h: 35 },
            'left_2': { x: 655, y: 420, w: 120, h: 35 },
            'left_3': { x: 827, y: 420, w: 120, h: 35 },

            // Movimento DIREITA (right) - 4 frames (sprites mais compridos)
            'right_0': { x: 277, y: 560, w: 120, h: 35 },
            'right_1': { x: 483, y: 560, w: 120, h: 35 },
            'right_2': { x: 655, y: 560, w: 120, h: 35 },
            'right_3': { x: 827, y: 560, w: 120, h: 35 },

            // Cabeça estática
            'head_up': { x: 100, y: 740, w: 45, h: 45 },
            'head_down': { x: 277, y: 740, w: 45, h: 45 },
            'head_left': { x: 453, y: 740, w: 45, h: 45 },
            'head_right': { x: 629, y: 740, w: 45, h: 45 },

            // Corpo (segmentos)
            'body_straight': { x: 102, y: 795, w: 30, h: 45 },
            'body_curve_left': { x: 233, y: 795, w: 35, h: 45 },
            'body_curve_right': { x: 364, y: 795, w: 35, h: 45 },
            'body_tail': { x: 495, y: 795, w: 25, h: 45 }
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
                console.log('✅ Sprite Sheet carregado com sucesso!');
                resolve();
            };
            this.spriteSheet.onerror = () => {
                console.error('❌ Erro ao carregar a sprite sheet em assets/sprites/cobra-sprites.png');
                resolve();
            };
            this.spriteSheet.src = 'assets/sprites/cobra-sprites.png';
        });
    }

    /**
     * Desenha um frame específico recortado da sprite sheet no Canvas
     */
    drawSprite(ctx, spriteKey, destX, destY, destW = 20, destH = 20) {
        if (!this.isLoaded || !this.spriteSheet) return;

        const sprite = this.spriteMap[spriteKey];
        if (!sprite) {
            console.warn(`Sprite não encontrado: ${spriteKey}`);
            return;
        }

        // Recupera largura e altura específicas do frame ou usa o padrão
        const cropWidth = sprite.w || this.DEFAULT_WIDTH;
        const cropHeight = sprite.h || this.DEFAULT_HEIGHT;

        // Executa o corte e o desenho no Canvas
        ctx.drawImage(
            this.spriteSheet,
            sprite.x,   // Origem X na imagem
            sprite.y,   // Origem Y na imagem
            cropWidth,  // Largura do recorte na imagem
            cropHeight, // Altura do recorte na imagem
            destX,      // Posição X no Canvas
            destY,      // Posição Y no Canvas
            destW,      // Largura final no Canvas (tamanho da célula da grid)
            destH       // Altura final no Canvas (tamanho da célula da grid)
        );
    }

    /**
     * Retorna a chave de sprite para uma direção de movimento animado
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
     * Retorna sprite de cabeça estática para uma direção
     */
    getHeadSpriteKey(direction) {
        if (direction.x === 0 && direction.y === -1) return 'head_up';
        if (direction.x === 0 && direction.y === 1) return 'head_down';
        if (direction.x === -1) return 'head_left';
        if (direction.x === 1) return 'head_right';
        return 'head_right';
    }

    /**
     * Retorna sprite de segmento do corpo
     */
    getBodySpriteKey(segmentType = 'straight') {
        return `body_${segmentType}`;
    }
}

// Criar instância global do gerenciador
const spriteManager = new SpriteManager();