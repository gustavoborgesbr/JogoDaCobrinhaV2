/**
 * Sprite Manager
 * Gerencia renderização gráfica em alta definição, geração de sprites vetoriais
 * proceduralmente para a cobra (cabeça com olhos e língua animada, corpo em curva e cauda cônica)
 * e suporte a skins visuais.
 */
class SpriteManager {
    constructor() {
        this.isLoaded = true;
        this.currentSkin = 'emerald'; // 'emerald', 'gold', 'shadow', 'crimson'
        this.spriteCache = {};

        // Imagem de Fundo (Background Image HD)
        this.bgImage = new Image();
        this.bgImageLoaded = false;
        this.bgImage.onload = () => {
            this.bgImageLoaded = true;
        };
        this.bgImage.onerror = () => {
            if (!this.bgImage.src.includes('src/assets/images')) {
                this.bgImage.src = 'src/assets/images/hub_background_1786904538723.jpg';
            }
        };
        this.bgImage.src = 'assets/sprites/hub-background.jpg';

        // Apple item image
        this.appleImage = new Image();
        this.appleImageLoaded = false;
        this.appleImage.onload = () => {
            this.appleImageLoaded = true;
        };
        this.appleImage.src = 'assets/apple.png';

        // Paletas de cores para as skins da cobra RPG
        this.palettes = {
            emerald: {
                primary: '#27ae60',
                secondary: '#2ecc71',
                highlight: '#a8f0c6',
                shadow: '#145a32',
                belly: '#82e0aa',
                eyes: '#f1c40f',
                pupil: '#1e272e',
                tongue: '#e74c3c',
                horn: '#f39c12'
            },
            gold: {
                primary: '#d4ac0d',
                secondary: '#f1c40f',
                highlight: '#fef9e7',
                shadow: '#7d6608',
                belly: '#f9e79f',
                eyes: '#e74c3c',
                pupil: '#1e272e',
                tongue: '#c0392b',
                horn: '#ffffff'
            },
            shadow: {
                primary: '#6c5ce7',
                secondary: '#a29bfe',
                highlight: '#dfe6e9',
                shadow: '#2d3436',
                belly: '#b2bec3',
                eyes: '#00cec9',
                pupil: '#0984e3',
                tongue: '#fd79a8',
                horn: '#e84393'
            },
            crimson: {
                primary: '#c0392b',
                secondary: '#e74c3c',
                highlight: '#fadbd8',
                shadow: '#641e16',
                belly: '#f5b7b1',
                eyes: '#f39c12',
                pupil: '#2c3e50',
                tongue: '#8e44ad',
                horn: '#f1c40f'
            }
        };

        this.generateAllSprites();
    }

    async init() {
        this.generateAllSprites();
        this.isLoaded = true;
        return Promise.resolve();
    }

    setSkin(skinName) {
        if (this.palettes[skinName]) {
            this.currentSkin = skinName;
            this.generateAllSprites();
        }
    }

    /**
     * Gera todos os sprites proceduralmente em Canvas Offscreen para máxima performance e nitidez
     */
    generateAllSprites() {
        const p = this.palettes[this.currentSkin] || this.palettes.emerald;
        const size = 40; // Resolução base do sprite (2x a célula de 20x20 para super antialiasing)

        this.spriteCache = {};

        // 1. Cabeças nas 4 direções e com variações de língua (frame 0: recolhida, frame 1: estendida)
        const directions = ['right', 'down', 'left', 'up'];
        directions.forEach((dir, dirIdx) => {
            const angle = dirIdx * (Math.PI / 2); // 0, 90, 180, 270 deg

            // Frame 0: Língua levemente para fora
            this.spriteCache[`head_${dir}_0`] = this.createHeadCanvas(size, angle, p, 0);
            // Frame 1: Língua esticada e bifurcada
            this.spriteCache[`head_${dir}_1`] = this.createHeadCanvas(size, angle, p, 1);
            // Frame estático
            this.spriteCache[`head_${dir}`] = this.spriteCache[`head_${dir}_0`];
        });

        // 2. Segmentos retos de corpo
        this.spriteCache['body_h'] = this.createStraightBodyCanvas(size, p, true);
        this.spriteCache['body_v'] = this.createStraightBodyCanvas(size, p, false);
        this.spriteCache['body_straight'] = this.spriteCache['body_h'];

        // 3. Curvas de conexão do corpo (4 tipos de esquinas)
        this.spriteCache['curve_bottom_right'] = this.createCurveBodyCanvas(size, p, 0);   // De cima/esq para baixo/dir
        this.spriteCache['curve_bottom_left'] = this.createCurveBodyCanvas(size, p, 1);    // De cima/dir para baixo/esq
        this.spriteCache['curve_top_left'] = this.createCurveBodyCanvas(size, p, 2);       // De baixo/dir para cima/esq
        this.spriteCache['curve_top_right'] = this.createCurveBodyCanvas(size, p, 3);      // De baixo/esq para cima/dir

        // 4. Caudas nas 4 direções
        directions.forEach((dir, dirIdx) => {
            const angle = dirIdx * (Math.PI / 2);
            this.spriteCache[`tail_${dir}`] = this.createTailCanvas(size, angle, p);
        });
    }

    createHeadCanvas(size, angle, p, tongueFrame) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        const cx = size / 2;
        const cy = size / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Língua bifurcada animada
        if (tongueFrame === 1) {
            ctx.strokeStyle = p.tongue;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(size * 0.35, 0);
            ctx.lineTo(size * 0.52, 0);
            ctx.lineTo(size * 0.58, -3);
            ctx.moveTo(size * 0.52, 0);
            ctx.lineTo(size * 0.58, 3);
            ctx.stroke();
        } else {
            ctx.strokeStyle = p.tongue;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(size * 0.35, 0);
            ctx.lineTo(size * 0.42, 0);
            ctx.stroke();
        }

        // Sombra / Profundidade da Cabeça
        ctx.fillStyle = p.shadow;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.42, size * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();

        // Base da Cabeça da Serpente (formato aerodinâmico de dragão/víbora)
        const grad = ctx.createRadialGradient(-size * 0.1, -size * 0.1, 2, 0, 0, size * 0.42);
        grad.addColorStop(0, p.highlight);
        grad.addColorStop(0.3, p.secondary);
        grad.addColorStop(0.85, p.primary);
        grad.addColorStop(1, p.shadow);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(size * 0.38, 0); // Focinho
        ctx.quadraticCurveTo(size * 0.25, -size * 0.35, -size * 0.25, -size * 0.32); // Bochecha superior
        ctx.quadraticCurveTo(-size * 0.42, 0, -size * 0.25, size * 0.32); // Nuca
        ctx.quadraticCurveTo(size * 0.25, size * 0.35, size * 0.38, 0); // Bochecha inferior
        ctx.closePath();
        ctx.fill();

        // Chifres / Escamas cristas (Aspecto RPG / Dragão)
        ctx.fillStyle = p.horn;
        ctx.beginPath();
        ctx.moveTo(-size * 0.15, -size * 0.22);
        ctx.lineTo(-size * 0.38, -size * 0.36);
        ctx.lineTo(-size * 0.24, -size * 0.15);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-size * 0.15, size * 0.22);
        ctx.lineTo(-size * 0.38, size * 0.36);
        ctx.lineTo(-size * 0.24, size * 0.15);
        ctx.closePath();
        ctx.fill();

        // Olhos de Serpente (Direcionais)
        const drawEye = (ex, ey) => {
            // Fundo do olho
            ctx.fillStyle = p.eyes;
            ctx.beginPath();
            ctx.ellipse(ex, ey, 4.5, 3.2, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Pupila fenda vertical
            ctx.fillStyle = p.pupil;
            ctx.beginPath();
            ctx.ellipse(ex + 0.8, ey, 1.3, 3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Brilho no olho
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ex + 1.5, ey - 1.2, 1, 0, Math.PI * 2);
            ctx.fill();
        };

        drawEye(size * 0.12, -size * 0.18);
        drawEye(size * 0.12, size * 0.18);

        // Narinas
        ctx.fillStyle = p.shadow;
        ctx.beginPath();
        ctx.arc(size * 0.3, -size * 0.06, 1.2, 0, Math.PI * 2);
        ctx.arc(size * 0.3, size * 0.06, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return c;
    }

    createStraightBodyCanvas(size, p, isHorizontal) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');

        const radius = size * 0.34;
        const cx = size / 2;
        const cy = size / 2;

        if (isHorizontal) {
            // Gradiente cilíndrico horizontal
            const grad = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
            grad.addColorStop(0, p.shadow);
            grad.addColorStop(0.2, p.highlight);
            grad.addColorStop(0.5, p.secondary);
            grad.addColorStop(0.85, p.primary);
            grad.addColorStop(1, p.shadow);

            ctx.fillStyle = grad;
            ctx.fillRect(0, cy - radius, size, radius * 2);

            // Escamas centrais losango / detalhes
            ctx.fillStyle = p.belly;
            ctx.beginPath();
            ctx.ellipse(cx, cy, radius * 0.6, radius * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Borda de escama
            ctx.strokeStyle = p.shadow;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, cy - radius);
            ctx.lineTo(size, cy - radius);
            ctx.moveTo(0, cy + radius);
            ctx.lineTo(size, cy + radius);
            ctx.stroke();
        } else {
            // Vertical
            const grad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
            grad.addColorStop(0, p.shadow);
            grad.addColorStop(0.2, p.highlight);
            grad.addColorStop(0.5, p.secondary);
            grad.addColorStop(0.85, p.primary);
            grad.addColorStop(1, p.shadow);

            ctx.fillStyle = grad;
            ctx.fillRect(cx - radius, 0, radius * 2, size);

            // Escama
            ctx.fillStyle = p.belly;
            ctx.beginPath();
            ctx.ellipse(cx, cy, radius * 0.3, radius * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = p.shadow;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - radius, 0);
            ctx.lineTo(cx - radius, size);
            ctx.moveTo(cx + radius, 0);
            ctx.lineTo(cx + radius, size);
            ctx.stroke();
        }

        return c;
    }

    createCurveBodyCanvas(size, p, rotationQuarter) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');

        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate(rotationQuarter * (Math.PI / 2));
        ctx.translate(-size / 2, -size / 2);

        const radius = size * 0.34;
        const cx = size;
        const cy = size;

        // Preenchimento de arco suave da curva
        const grad = ctx.createRadialGradient(cx, cy, size - radius * 2, cx, cy, size);
        grad.addColorStop(0, p.shadow);
        grad.addColorStop(0.3, p.primary);
        grad.addColorStop(0.6, p.secondary);
        grad.addColorStop(0.85, p.highlight);
        grad.addColorStop(1, p.shadow);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, size, Math.PI, 1.5 * Math.PI, false);
        ctx.lineTo(cx - radius * 2, cy - size);
        ctx.arc(cx, cy, size - radius * 2, 1.5 * Math.PI, Math.PI, true);
        ctx.closePath();
        ctx.fill();

        // Conector de transição suave
        ctx.fillStyle = p.secondary;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius * 0.95, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.highlight;
        ctx.beginPath();
        ctx.arc(size / 2 - 2, size / 2 - 2, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return c;
    }

    createTailCanvas(size, angle, p) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        const cx = size / 2;
        const cy = size / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Ponta cônica suave da cauda (apontando para a esquerda/trás)
        const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, size * 0.45);
        grad.addColorStop(0, p.highlight);
        grad.addColorStop(0.4, p.secondary);
        grad.addColorStop(0.85, p.primary);
        grad.addColorStop(1, p.shadow);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(size * 0.35, -size * 0.32); // Conexão com o corpo
        ctx.quadraticCurveTo(-size * 0.1, -size * 0.2, -size * 0.42, 0); // Ponta fina
        ctx.quadraticCurveTo(-size * 0.1, size * 0.2, size * 0.35, size * 0.32); // Conexão inferior
        ctx.closePath();
        ctx.fill();

        // Espigão / ferrão mágico na ponta
        ctx.fillStyle = p.horn;
        ctx.beginPath();
        ctx.moveTo(-size * 0.25, -3);
        ctx.lineTo(-size * 0.46, 0);
        ctx.lineTo(-size * 0.25, 3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        return c;
    }

    /**
     * Desenha o sprite pré-renderizado no Canvas principal
     */
    drawSprite(ctx, spriteKey, destX, destY, destW = 20, destH = 20) {
        const sprite = this.spriteCache[spriteKey];
        if (sprite) {
            ctx.drawImage(sprite, 0, 0, sprite.width, sprite.height, destX, destY, destW, destH);
        } else {
            // Fallback elegante
            ctx.fillStyle = this.palettes[this.currentSkin]?.primary || '#27ae60';
            ctx.beginPath();
            ctx.roundRect(destX + 1, destY + 1, destW - 2, destH - 2, 4);
            ctx.fill();
        }
    }

    /**
     * Desenha a Imagem de Fundo HD no Canvas com filtro de cor temático por Fase
     */
    drawStageBackground(ctx, stageType = 1) {
        if (this.bgImage && (this.bgImageLoaded || (this.bgImage.complete && this.bgImage.naturalWidth > 0))) {
            ctx.drawImage(this.bgImage, 0, 0, grid.width, grid.height);

            // Overlay de filtro temático semitransparente
            if (stageType === 1) {
                // Floresta Mística (Tom verde floresta)
                ctx.fillStyle = 'rgba(10, 32, 20, 0.72)';
            } else if (stageType === 2) {
                // Caverna de Cristal (Tom azul safira)
                ctx.fillStyle = 'rgba(8, 25, 48, 0.75)';
            } else if (stageType === 3) {
                // Templo do Dragão (Tom rubi vulcânico)
                ctx.fillStyle = 'rgba(38, 10, 10, 0.78)';
            } else {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            }
            ctx.fillRect(0, 0, grid.width, grid.height);
        } else {
            // Fallback para gradiente ou cor sólida caso a imagem ainda esteja carregando
            ctx.fillStyle = stageType === 1 ? '#0d2818' : (stageType === 2 ? '#081a2e' : '#1a0808');
            ctx.fillRect(0, 0, grid.width, grid.height);
        }
    }
}

// Criar instância global do gerenciador
const spriteManager = new SpriteManager();
