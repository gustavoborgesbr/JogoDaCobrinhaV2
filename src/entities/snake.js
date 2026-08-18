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

        // Upgrades permanentes
        const upgrades = saveSystem.getUpgrades();
        const baseSpeed = 140;
        let finalSpeed = Math.max(70, baseSpeed - (upgrades.speed || 0) * 12);
        
        if (window.game && window.game.difficulty) {
            finalSpeed = finalSpeed / window.game.difficulty.speedMult;
        }
        
        this.speed = finalSpeed;
        this.lastMoveTime = Date.now();

        // Atributos de Vida & RPG
        const bonusHp = upgrades.maxHp || 0;
        this.maxHealth = 3 + bonusHp;
        this.health = this.maxHealth;

        this.level = 1;
        this.xp = 0;
        this.runXP = 0;
        this.xpToNextLevel = 100;
        this.itemsCollected = 0;
        this.enemiesDefeated = 0;

        // Buffs e Habilidades Ativas
        this.isDashing = false;
        this.dashUntil = 0;
        this.hasShield = false;
        this.shieldUntil = 0;
        this.isMagnetActive = false;
        this.magnetUntil = 0;
        this.isDevourActive = false;
        this.devourUntil = 0;
        this.damageBuff = false;
        this.damageBuffUntil = 0;
        this.isDead = false;

        // Imunidade de Spawn (5 segundos protegendo o jogador no início das fases)
        this.spawnImmunityDuration = 5000;
        this.spawnImmuneUntil = Date.now() + this.spawnImmunityDuration;

        // Invulnerabilidade temporária pós-dano
        this.isHurt = false;
        this.invulnerableUntil = this.spawnImmuneUntil;

        // Animação de sprites
        this.animationFrameIndex = 0;
        this.animationSpeed = 100;
        this.lastAnimationTime = Date.now();

        this.color = '#27ae60';
        this.headColor = '#2ecc71';
    }

    update() {
        const now = Date.now();

        // Atualizar timers de buffs
        if (this.isDashing && now >= this.dashUntil) this.isDashing = false;
        if (this.hasShield && now >= this.shieldUntil) this.hasShield = false;
        if (this.isMagnetActive && now >= this.magnetUntil) this.isMagnetActive = false;
        if (this.damageBuff && now >= this.damageBuffUntil) this.damageBuff = false;
        if (this.isHurt && now >= this.invulnerableUntil) this.isHurt = false;

        // Movimento no grid respeitando a velocidade (ou velocidade acelerada se em Dash)
        const currentSpeed = this.isDashing ? this.speed * 0.4 : this.speed;
        if (now - this.lastMoveTime < currentSpeed) return;

        this.lastMoveTime = now;
        this.direction = input.getNextDirection();

        // Calcular nova cabeça
        const head = this.body[0];
        let newHead = {
            gridX: head.gridX + this.direction.x,
            gridY: head.gridY + this.direction.y
        };

        // Verificar colisão com paredes do grid
        if (!grid.isValidPosition(newHead.gridX, newHead.gridY)) {
            this.handleWallCollision(newHead);
            return;
        }

        // Verificar colisão com obstáculos de fase
        if (window.game && window.game.currentStageObject && window.game.currentStageObject.isObstacle(newHead.gridX, newHead.gridY)) {
            this.handleObstacleCollision();
            return;
        }

        // Verificar colisão com o próprio corpo
        if (this.checkSelfCollision(newHead)) {
            if (!this.isDashing) {
                this.takeDamage(1, 'Colisão com o próprio corpo!');
            }
            return;
        }

        // Avançar cobra
        this.body.unshift(newHead);
        this.body.pop();

        // Rastro de partículas no Dash
        if (this.isDashing && typeof particleSystem !== 'undefined') {
            const headPos = grid.gridToPixels(head.gridX, head.gridY);
            particleSystem.createTrail(headPos.pixelX + grid.cellSize / 2, headPos.pixelY + grid.cellSize / 2, '#3498db');
        }
    }

    handleWallCollision(attemptedHead) {
        if (this.hasShield) {
            this.hasShield = false;
            if (typeof particleSystem !== 'undefined') {
                const head = this.body[0];
                const pos = grid.gridToPixels(head.gridX, head.gridY);
                particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, '#f1c40f', 10);
                particleSystem.createFloatingText('Escudo Protegeu!', pos.pixelX + grid.cellSize / 2, pos.pixelY, '#f1c40f');
            }
            return;
        }

        // Rebater / Dano por colisão na borda
        this.takeDamage(1, 'Bateu na borda!');
    }

    handleObstacleCollision() {
        if (this.hasShield) {
            this.hasShield = false;
            return;
        }
        this.takeDamage(1, 'Bateu em obstáculo de pedra!');
    }

    checkSelfCollision(head) {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].gridX === head.gridX && this.body[i].gridY === head.gridY) {
                return true;
            }
        }
        return false;
    }

    grow(segments = 1) {
        for (let i = 0; i < segments; i++) {
            const tail = this.body[this.body.length - 1];
            this.body.push({ ...tail });
        }
    }

    gainXP(amount) {
        this.xp += amount;
        this.runXP += amount;
        if (typeof particleSystem !== 'undefined') {
            const head = this.getHeadPosition();
            const pos = grid.gridToPixels(head.gridX, head.gridY);
            particleSystem.createFloatingText(`+${amount} XP`, pos.pixelX + grid.cellSize / 2, pos.pixelY - 10, '#2ecc71');
        }

        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(100 * Math.pow(this.level, 1.4));
        this.maxHealth++;
        this.health = this.maxHealth;

        if (typeof sfx !== 'undefined') sfx.playLevelUp();
        if (typeof particleSystem !== 'undefined') {
            const head = this.getHeadPosition();
            const pos = grid.gridToPixels(head.gridX, head.gridY);
            particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, '#f1c40f', 24);
            particleSystem.createFloatingText('LEVEL UP!', pos.pixelX + grid.cellSize / 2, pos.pixelY - 20, '#f1c40f');
        }

        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage(`⭐ LEVEL UP! Nível ${this.level} (Vida Máx Aumentada!)`, 2000);
        }
    }

    takeDamage(amount, reason = '') {
        if (this.isDead) return;
        const now = Date.now();
        if (now < this.invulnerableUntil || this.isDashing) return;

        if (this.hasShield) {
            this.hasShield = false;
            this.invulnerableUntil = now + 400;
            if (typeof sfx !== 'undefined' && sfx.playHit) sfx.playHit();
            if (typeof particleSystem !== 'undefined') {
                const head = this.getHeadPosition();
                const pos = grid.gridToPixels(head.gridX, head.gridY);
                particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, '#f1c40f', 15);
                particleSystem.createFloatingText('ESCUDO BLOQUEOU!', pos.pixelX + grid.cellSize / 2, pos.pixelY - 10, '#f1c40f');
            }
            return;
        }

        this.health -= amount;
        this.isHurt = true;
        this.invulnerableUntil = now + 900; // 900ms de invulnerabilidade após levar dano

        if (typeof sfx !== 'undefined' && sfx.playHit) sfx.playHit();
        if (typeof particleSystem !== 'undefined') {
            const head = this.getHeadPosition();
            const pos = grid.gridToPixels(head.gridX, head.gridY);
            particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, '#e74c3c', 16);
            particleSystem.createFloatingText(`-${amount} HP`, pos.pixelX + grid.cellSize / 2, pos.pixelY - 10, '#e74c3c');
        }

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            if (typeof sfx !== 'undefined' && sfx.playGameOver) sfx.playGameOver();
            if (window.game) window.game.gameOver();
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        if (typeof particleSystem !== 'undefined') {
            const head = this.getHeadPosition();
            const pos = grid.gridToPixels(head.gridX, head.gridY);
            particleSystem.createExplosion(pos.pixelX + grid.cellSize / 2, pos.pixelY + grid.cellSize / 2, '#2ecc71', 12);
            particleSystem.createFloatingText(`+${amount} HP`, pos.pixelX + grid.cellSize / 2, pos.pixelY - 10, '#2ecc71');
        }
    }

    devourEnemy(enemy) {
        if (typeof sfx !== 'undefined' && sfx.playBite) {
            sfx.playBite();
        }

        const healAmount = 25;
        this.heal(healAmount);
        this.grow(1);
        
        const xpGain = (enemy.xpReward || 15) * 2;
        this.gainXP(xpGain);
        this.enemiesDefeated++;

        const head = this.getHeadPosition();
        const pos = grid.gridToPixels(head.gridX, head.gridY);
        const centerX = pos.pixelX + grid.cellSize / 2;
        const centerY = pos.pixelY + grid.cellSize / 2;

        if (typeof particleSystem !== 'undefined') {
            particleSystem.createExplosion(centerX, centerY, '#ef4444', 24);
            particleSystem.createExplosion(centerX, centerY, '#f59e0b', 16);
            particleSystem.createFloatingText('🍴 NHAC! DEVORADO! (+25 HP)', centerX, centerY - 14, '#f87171');
        }

        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage('🍴 Monstro Devorado! +25 HP & XP em Dobro!', 1400);
        }
    }

    updateAnimation() {
        const now = Date.now();
        if (now - this.lastAnimationTime >= this.animationSpeed) {
            this.animationFrameIndex = (this.animationFrameIndex + 1) % 2;
            this.lastAnimationTime = now;
        }
    }

    render(ctx) {
        const now = Date.now();
        // Efeito de piscar quando invulnerável
        const isBlinking = now < this.invulnerableUntil && Math.floor(now / 100) % 2 === 0;
        if (isBlinking) {
            ctx.save();
            ctx.globalAlpha = 0.5;
        }

        this.updateAnimation();

        // 1. Renderizar Cauda
        if (this.body.length > 1) {
            const tailIndex = this.body.length - 1;
            const tail = this.body[tailIndex];
            const beforeTail = this.body[tailIndex - 1];
            const tailPos = grid.gridToPixels(tail.gridX, tail.gridY);

            const dx = tail.gridX - beforeTail.gridX;
            const dy = tail.gridY - beforeTail.gridY;

            let tailDir = 'left';
            if (dx === 1) tailDir = 'right';
            else if (dx === -1) tailDir = 'left';
            else if (dy === 1) tailDir = 'down';
            else if (dy === -1) tailDir = 'up';

            const tailSpriteKey = `tail_${tailDir}`;
            if (typeof spriteManager !== 'undefined' && spriteManager.isLoaded) {
                spriteManager.drawSprite(ctx, tailSpriteKey, tailPos.pixelX, tailPos.pixelY, grid.cellSize, grid.cellSize);
            }
        }

        // 2. Renderizar Corpo (Segmentos intermediários com curvas e conexões perfeitas)
        for (let i = this.body.length - 2; i >= 1; i--) {
            const current = this.body[i];
            const prev = this.body[i - 1];
            const next = this.body[i + 1];
            const pos = grid.gridToPixels(current.gridX, current.gridY);

            const dx1 = prev.gridX - current.gridX;
            const dy1 = prev.gridY - current.gridY;
            const dx2 = next.gridX - current.gridX;
            const dy2 = next.gridY - current.gridY;

            let bodySpriteKey = 'body_h';

            if (dy1 === 0 && dy2 === 0) {
                bodySpriteKey = 'body_h';
            } else if (dx1 === 0 && dx2 === 0) {
                bodySpriteKey = 'body_v';
            } else {
                // Curvas / Esquinas suaves
                const hasLeft = (dx1 === -1 || dx2 === -1);
                const hasRight = (dx1 === 1 || dx2 === 1);
                const hasTop = (dy1 === -1 || dy2 === -1);
                const hasBottom = (dy1 === 1 || dy2 === 1);

                if (hasTop && hasLeft) bodySpriteKey = 'curve_top_left';
                else if (hasTop && hasRight) bodySpriteKey = 'curve_top_right';
                else if (hasBottom && hasLeft) bodySpriteKey = 'curve_bottom_left';
                else if (hasBottom && hasRight) bodySpriteKey = 'curve_bottom_right';
            }

            if (typeof spriteManager !== 'undefined' && spriteManager.isLoaded) {
                spriteManager.drawSprite(ctx, bodySpriteKey, pos.pixelX, pos.pixelY, grid.cellSize, grid.cellSize);
            }
        }

        // 3. Renderizar Cabeça
        const head = this.body[0];
        const headPos = grid.gridToPixels(head.gridX, head.gridY);

        let headDir = 'right';
        if (this.direction.x === 1) headDir = 'right';
        else if (this.direction.x === -1) headDir = 'left';
        else if (this.direction.y === 1) headDir = 'down';
        else if (this.direction.y === -1) headDir = 'up';

        const headSpriteKey = `head_${headDir}_${this.animationFrameIndex}`;

        if (typeof spriteManager !== 'undefined' && spriteManager.isLoaded) {
            spriteManager.drawSprite(ctx, headSpriteKey, headPos.pixelX, headPos.pixelY, grid.cellSize, grid.cellSize);
        }

        // 4. Aura de Imunidade de Spawn (Proteção Divina de 5s no Início)
        if (now < this.spawnImmuneUntil) {
            ctx.save();
            const timeLeftSec = Math.ceil((this.spawnImmuneUntil - now) / 1000);
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            const pulse = Math.sin(now / 120) * 3;
            ctx.arc(headPos.pixelX + grid.cellSize / 2, headPos.pixelY + grid.cellSize / 2, grid.cellSize + 4 + pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Texto indicando tempo de imunidade
            ctx.fillStyle = '#a7f3d0';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`🛡️ ${timeLeftSec}s`, headPos.pixelX + grid.cellSize / 2, headPos.pixelY - 8);
            ctx.restore();
        }

        // 5. Aura de Dash
        if (this.isDashing) {
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(headPos.pixelX + grid.cellSize / 2, headPos.pixelY + grid.cellSize / 2, grid.cellSize * 0.85, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 5. Aura de Escudo
        if (this.hasShield) {
            ctx.save();
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#f1c40f';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(headPos.pixelX + grid.cellSize / 2, headPos.pixelY + grid.cellSize / 2, grid.cellSize * 0.95, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 6. Aura de Magnetismo
        if (this.isMagnetActive) {
            ctx.save();
            ctx.strokeStyle = 'rgba(155, 89, 182, 0.7)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#8b5cf6';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            const pulse = 8 + Math.sin(now / 150) * 4;
            ctx.arc(headPos.pixelX + grid.cellSize / 2, headPos.pixelY + grid.cellSize / 2, grid.cellSize + pulse, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 7. Aura da Fauce Devoradora (Mandíbulas Vorazes)
        if (this.isDevourActive) {
            ctx.save();
            const centerX = headPos.pixelX + grid.cellSize / 2;
            const centerY = headPos.pixelY + grid.cellSize / 2;
            const chomp = Math.abs(Math.sin(now / 100)); // Animação de mastigação rápida

            // Aura de fogo carmesim
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#dc2626';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(centerX, centerY, grid.cellSize * 1.1 + chomp * 4, 0, Math.PI * 2);
            ctx.stroke();

            // Presas afiadas / Mandíbulas animadas
            ctx.fillStyle = '#fee2e2';
            ctx.shadowColor = '#f87171';
            ctx.shadowBlur = 10;

            const dirAngle = Math.atan2(this.direction.y, this.direction.x);
            const biteOpen = (0.35 + chomp * 0.45);

            // Mandíbula Superior
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, grid.cellSize * 1.3, dirAngle - biteOpen, dirAngle - 0.05);
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            // Mandíbula Inferior
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, grid.cellSize * 1.3, dirAngle + 0.05, dirAngle + biteOpen);
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            // Texto indicativo
            ctx.fillStyle = '#fca5a5';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('🦷 DEVORAR', centerX, centerY - 14);

            ctx.restore();
        }

        if (isBlinking) {
            ctx.restore();
        }
    }

    getHeadPosition() {
        return this.body[0];
    }
}
