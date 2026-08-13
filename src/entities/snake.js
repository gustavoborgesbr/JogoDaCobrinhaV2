/**
 * Snake
 * Entidade principal - cobra do jogador
 */

class Snake {
    constructor(startX, startY) {
        this.body = [
            { gridX: startX, gridY: startY },
            { gridX: startX - 1, gridY: startY },
            { gridX: startX - 2, gridY: startY }
        ];
        
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        this.speed = 150; // ms entre ticks
        this.lastMoveTime = Date.now();
        
        this.health = 3;
        this.maxHealth = 3;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;

        // Sistema de animação
        this.animationFrameIndex = 0;
        this.animationSpeed = 100; // ms entre frames
        this.lastAnimationTime = Date.now();

        this.color = '#27ae60';
        this.headColor = '#2ecc71';
    }

    /**
     * Processa entrada e move a cobra
     */
    update() {
        const now = Date.now();
        if (now - this.lastMoveTime < this.speed) return;

        this.lastMoveTime = now;
        this.direction = input.getNextDirection();

        // Calcula nova posição da cabeça
        const head = this.body[0];
        const newHead = {
            gridX: head.gridX + this.direction.x,
            gridY: head.gridY + this.direction.y
        };

        // Verifica colisão com parede
        if (!grid.isValidPosition(newHead.gridX, newHead.gridY)) {
            this.takeDamage(1);
            return;
        }

        // Verifica colisão com o próprio corpo
        if (this.checkSelfCollision(newHead)) {
            this.takeDamage(1);
            return;
        }

        // Adiciona nova cabeça
        this.body.unshift(newHead);

        // Remove cauda (ou mantém se comeu item)
        this.body.pop();
    }

    /**
     * Verifica colisão com o próprio corpo
     */
    checkSelfCollision(head) {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].gridX === head.gridX && this.body[i].gridY === head.gridY) {
                return true;
            }
        }
        return false;
    }

    /**
     * Cresce (quando come item)
     */
    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ ...tail });
    }

    /**
     * Ganha XP
     */
    gainXP(amount) {
        this.xp += amount;
        console.log(`⭐ +${amount} XP`);

        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    /**
     * Sobe de nível
     */
    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpToNextLevel = Math.floor(100 * Math.pow(this.level, 1.5));
        this.maxHealth++;
        this.health = this.maxHealth;
        
        // Velocidade aumenta com nível
        this.speed = Math.max(50, 150 - this.level * 5);

        console.log(`🎉 Level Up! Nível ${this.level}`);

        if (window.game) window.game.levelUp();
    }

    /**
     * Toma dano
     */
    takeDamage(amount) {
        this.health -= amount;
        console.log(`💔 Dano! Vida: ${this.health}/${this.maxHealth}`);

        if (this.health <= 0) {
            if (window.game) window.game.gameOver();
        }
    }

    /**
     * Cura
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    /**
     * Atualiza animação
     */
    updateAnimation() {
        const now = Date.now();
        if (now - this.lastAnimationTime >= this.animationSpeed) {
            // Aumentar frame baseado na direção
            const maxFrames = (this.direction.x === 0) ? 5 : 4;
            this.animationFrameIndex = (this.animationFrameIndex + 1) % maxFrames;
            this.lastAnimationTime = now;
        }
    }

    /**
     * Desenha a cobra no canvas com sprites
     */
    render(ctx) {
        if (!spriteManager.isLoaded) {
            // Fallback: desenho simples se sprites não carregarem
            this.renderFallback(ctx);
            return;
        }

        // Atualizar animação
        this.updateAnimation();

        // Desenhar corpo (segmentos)
        for (let i = 1; i < this.body.length; i++) {
            const pos = grid.gridToPixels(this.body[i].gridX, this.body[i].gridY);
            
            // Determinar tipo de segmento
            let segmentType = 'straight';
            if (i === this.body.length - 1) {
                segmentType = 'tail';
            }

            const spriteKey = spriteManager.getBodySpriteKey(segmentType);
            spriteManager.drawSprite(ctx, spriteKey, pos.pixelX, pos.pixelY, grid.cellSize, grid.cellSize);
        }

        // Desenhar cabeça com animação
        const headPos = grid.gridToPixels(this.body[0].gridX, this.body[0].gridY);
        
        // Usar sprite de movimento animado
        const movementSpriteKey = spriteManager.getMovementSpriteKey(this.direction, this.animationFrameIndex);
        spriteManager.drawSprite(ctx, movementSpriteKey, headPos.pixelX, headPos.pixelY, grid.cellSize, grid.cellSize);
    }

    /**
     * Renderização fallback (sem sprites)
     */
    renderFallback(ctx) {
        // Desenhar corpo
        ctx.fillStyle = this.color;
        for (let i = 1; i < this.body.length; i++) {
            const pos = grid.gridToPixels(this.body[i].gridX, this.body[i].gridY);
            ctx.fillRect(pos.pixelX + 1, pos.pixelY + 1, grid.cellSize - 2, grid.cellSize - 2);
        }

        // Desenhar cabeça
        ctx.fillStyle = this.headColor;
        const headPos = grid.gridToPixels(this.body[0].gridX, this.body[0].gridY);
        ctx.fillRect(headPos.pixelX + 1, headPos.pixelY + 1, grid.cellSize - 2, grid.cellSize - 2);

        // Olhos
        ctx.fillStyle = '#000';
        const eyeOffset = 5;
        ctx.fillRect(headPos.pixelX + eyeOffset, headPos.pixelY + eyeOffset, 3, 3);
        ctx.fillRect(headPos.pixelX + grid.cellSize - eyeOffset - 3, headPos.pixelY + eyeOffset, 3, 3);
    }

    /**
     * Obtém posição da cabeça
     */
    getHeadPosition() {
        return this.body[0];
    }
}
