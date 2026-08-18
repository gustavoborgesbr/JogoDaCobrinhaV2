/**
 * Boss - O Dragão / Serpente Anciã
 * Batalha final com fases, tiros, investidas e janelas de vulnerabilidade
 */

class BossStage {
    constructor() {
        this.name = 'O Trono da Serpente Anciã';
        this.theme = 'boss';
        this.bgColor = '#2b0909';
        this.accentColor = '#4a1212';

        this.enemies = new EnemyPool();
        this.items = new ItemPool();

        let baseMinionRate = 9000;
        let baseBossSpeed = 120;
        if (window.game && window.game.difficulty) {
            baseMinionRate = baseMinionRate / window.game.difficulty.spawnMult;
            baseBossSpeed = baseBossSpeed * window.game.difficulty.speedMult;
        }

        this.boss = {
            name: 'Serpente Anciã Draconiana',
            x: 400,
            y: 200,
            size: 44,
            maxHealth: 60,
            health: 60,
            isDead: false,
            phase: 1,
            state: 'stalking', // 'stalking', 'charging', 'vulnerable'
            stateTimer: 0,
            stateDuration: 4000,
            targetX: 400,
            targetY: 200,
            speed: baseBossSpeed,
            hurtUntil: 0,
            lastAttackTime: Date.now(),
            attackCooldown: 2200,
            segments: []
        };

        // Criar corpo do chefão (multi-segmentos)
        for (let i = 0; i < 6; i++) {
            this.boss.segments.push({ x: 400 - i * 30, y: 200 });
        }

        this.itemSpawnRate = 6000;
        this.lastItemSpawnTime = Date.now();
        this.minionSpawnRate = baseMinionRate;
        this.lastMinionSpawnTime = Date.now();
    }

    init() {
        console.log('🔥 Batalha de Chefão iniciada!');
        if (typeof sfx !== 'undefined') sfx.playBossRoar();
        this.boss.health = this.boss.maxHealth;
        this.boss.isDead = false;
        this.boss.state = 'stalking';
        this.boss.stateTimer = Date.now();

        this.enemies.clear();
        this.items.clear();

        // Spawn inicial de suprimentos na arena
        for (let i = 0; i < 4; i++) {
            const p = grid.randomPosition();
            this.items.spawnRandomItem(p.gridX, p.gridY);
        }
    }

    isObstacle(x, y) {
        // Pilares nos quatro cantos da arena do Boss
        const pillars = [
            { gridX: 6, gridY: 6 },
            { gridX: 34, gridY: 6 },
            { gridX: 6, gridY: 24 },
            { gridX: 34, gridY: 24 }
        ];
        return pillars.some(p => p.gridX === x && p.gridY === y);
    }

    update(snake) {
        if (this.boss.isDead) return;

        const now = Date.now();
        const head = snake.getHeadPosition();
        const playerPixels = grid.gridToPixels(head.gridX, head.gridY);
        const playerX = playerPixels.pixelX + grid.cellSize / 2;
        const playerY = playerPixels.pixelY + grid.cellSize / 2;

        // Fases do Boss (<50% HP entra em Fúria)
        if (this.boss.health <= this.boss.maxHealth / 2 && this.boss.phase === 1) {
            this.boss.phase = 2;
            let p2speed = 180;
            if (window.game && window.game.difficulty) p2speed *= window.game.difficulty.speedMult;
            this.boss.speed = p2speed;
            this.boss.attackCooldown = 1500;
            if (typeof sfx !== 'undefined') sfx.playBossRoar();
            if (typeof hud !== 'undefined' && hud.showMessage) {
                hud.showMessage('⚠️ O CHEFÃO ENTROU EM MODO FÚRIA!', 2500);
            }
        }

        // Máquina de estados do Boss
        if (now - this.boss.stateTimer > this.boss.stateDuration) {
            this.boss.stateTimer = now;
            if (this.boss.state === 'stalking') {
                this.boss.state = 'charging';
                this.boss.stateDuration = 2500;
                this.boss.targetX = playerX;
                this.boss.targetY = playerY;
                if (typeof particleSystem !== 'undefined') {
                    particleSystem.createFloatingText('INVESTIDA!', this.boss.x, this.boss.y - 20, '#e74c3c');
                }
            } else if (this.boss.state === 'charging') {
                // Entra em estado de VULNERABILIDADE
                this.boss.state = 'vulnerable';
                this.boss.stateDuration = 3500;
                if (typeof particleSystem !== 'undefined') {
                    particleSystem.createFloatingText('VULNERÁVEL! ATIRE AGORA!', this.boss.x, this.boss.y - 20, '#f1c40f');
                }
            } else {
                this.boss.state = 'stalking';
                this.boss.stateDuration = 4500;
            }
        }

        // Movimentação do Boss
        if (this.boss.state === 'stalking') {
            const dx = playerX - this.boss.x;
            const dy = playerY - this.boss.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 100) {
                this.boss.x += (dx / dist) * this.boss.speed * 0.016;
                this.boss.y += (dy / dist) * this.boss.speed * 0.016;
            }

            // Ataque de projéteis
            if (now - this.boss.lastAttackTime > this.boss.attackCooldown) {
                this.boss.lastAttackTime = now;
                this.fireBossProjectiles(playerX, playerY);
            }
        } else if (this.boss.state === 'charging') {
            const dx = this.boss.targetX - this.boss.x;
            const dy = this.boss.targetY - this.boss.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 10) {
                this.boss.x += (dx / dist) * (this.boss.speed * 1.8) * 0.016;
                this.boss.y += (dy / dist) * (this.boss.speed * 1.8) * 0.016;
            }
        }

        // Atualizar segmentos da cauda do Boss
        let prevX = this.boss.x;
        let prevY = this.boss.y;
        for (let i = 0; i < this.boss.segments.length; i++) {
            const seg = this.boss.segments[i];
            const dx = prevX - seg.x;
            const dy = prevY - seg.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 28) {
                seg.x += (dx / dist) * (dist - 28);
                seg.y += (dy / dist) * (dist - 28);
            }
            prevX = seg.x;
            prevY = seg.y;
        }

        // Spawns periódicos de itens
        if (now - this.lastItemSpawnTime > this.itemSpawnRate && this.items.getAll().length < 6) {
            const p = grid.randomPosition();
            this.items.spawnRandomItem(p.gridX, p.gridY);
            this.lastItemSpawnTime = now;
        }

        // Spawn de lacaios em Fase 2
        if (this.boss.phase === 2 && now - this.lastMinionSpawnTime > this.minionSpawnRate && this.enemies.getAll().length < 4) {
            const p = grid.randomPosition();
            this.enemies.addEnemy(p.gridX, p.gridY, 'fast');
            this.lastMinionSpawnTime = now;
        }

        // Atualizar entidades auxiliares
        this.enemies.updateAll(snake.getHeadPosition());
        this.items.updateAll(snake);

        // Colisão cobra x chefe (contato físico)
        const bossDist = Math.hypot(playerX - this.boss.x, playerY - this.boss.y);
        if (bossDist < this.boss.size + 10) {
            if (snake.isDevourActive) {
                // Mordida Devoradora massiva no Chefão!
                this.checkHit(playerX, playerY, 25);
                snake.heal(15);
                if (typeof sfx !== 'undefined' && sfx.playBite) sfx.playBite();
                if (typeof particleSystem !== 'undefined') {
                    particleSystem.createExplosion(playerX, playerY, '#ef4444', 28);
                    particleSystem.createFloatingText('🦷 MORDIDA DRACÔNICA! -25', playerX, playerY - 18, '#f87171');
                }
            } else if (this.boss.state === 'vulnerable' || snake.isDashing) {
                this.checkHit(playerX, playerY, 4);
            } else {
                snake.takeDamage(1, 'Esmagado pelo chefão!');
            }
        }

        // Checar itens
        this.items.getAll().forEach(item => {
            if (item.gridX === head.gridX && item.gridY === head.gridY) {
                combatSystem.resolveSnakeItemCollision(snake, item);
            }
        });

        // Checar inimigos menores
        this.enemies.getAll().forEach(enemy => {
            if (enemy.gridX === head.gridX && enemy.gridY === head.gridY) {
                combatSystem.resolveSnakeEnemyCollision(snake, enemy);
            }
        });
    }

    fireBossProjectiles(targetX, targetY) {
        const count = this.boss.phase === 2 ? 6 : 4;
        const baseAngle = Math.atan2(targetY - this.boss.y, targetX - this.boss.x);

        for (let i = 0; i < count; i++) {
            const spread = (i - (count - 1) / 2) * 0.25;
            const angle = baseAngle + spread;
            const speed = 230;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            projectilePool.spawn(this.boss.x, this.boss.y, vx, vy, false, 1, '#e74c3c', 6);
        }
    }

    checkHit(px, py, damage) {
        const dist = Math.hypot(px - this.boss.x, py - this.boss.y);
        if (dist < this.boss.size + 8) {
            // Se estiver vulnerável, sofre dano crítico (x3)!
            const isCrit = this.boss.state === 'vulnerable';
            const finalDamage = isCrit ? damage * 3 : damage;

            this.boss.health -= finalDamage;
            this.boss.hurtUntil = Date.now() + 150;

            if (typeof particleSystem !== 'undefined') {
                particleSystem.createExplosion(this.boss.x, this.boss.y, isCrit ? '#f1c40f' : '#e74c3c', 16);
                particleSystem.createFloatingText(
                    isCrit ? `CRÍTICO! -${finalDamage}` : `-${finalDamage}`,
                    this.boss.x,
                    this.boss.y - 25,
                    isCrit ? '#f1c40f' : '#ffffff'
                );
            }

            if (this.boss.health <= 0) {
                this.boss.health = 0;
                this.boss.isDead = true;
                if (typeof sfx !== 'undefined') sfx.playLevelUp();
                if (window.game) window.game.victory();
            }
            return true;
        }
        return false;
    }

    getGoalText(snake) {
        const hpPercent = Math.floor((this.boss.health / this.boss.maxHealth) * 100);
        const stateText = this.boss.state === 'vulnerable' ? '⚠️ VULNERÁVEL (ATIRE!)' : (this.boss.state === 'charging' ? '⚡ INVESTIDA' : '🐉 CAÇANDO');
        return `👑 ${this.boss.name}: ${this.boss.health}/${this.boss.maxHealth} HP (${hpPercent}%) • [${stateText}]`;
    }

    render(ctx, snake) {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, grid.width, grid.height);

        // Grade temática
        ctx.fillStyle = 'rgba(60, 15, 15, 0.3)';
        for (let x = 0; x < grid.cols; x += 4) {
            for (let y = 0; y < grid.rows; y += 4) {
                ctx.fillRect(x * grid.cellSize, y * grid.cellSize, grid.cellSize * 2, grid.cellSize * 2);
            }
        }

        // Renderizar pilares da arena
        const pillars = [
            { gridX: 6, gridY: 6 },
            { gridX: 34, gridY: 6 },
            { gridX: 6, gridY: 24 },
            { gridX: 34, gridY: 24 }
        ];
        ctx.fillStyle = '#8e44ad';
        pillars.forEach(p => {
            const pos = grid.gridToPixels(p.gridX, p.gridY);
            ctx.beginPath();
            ctx.roundRect(pos.pixelX - 4, pos.pixelY - 4, grid.cellSize + 8, grid.cellSize + 8, 6);
            ctx.fill();
        });

        // Renderizar cauda do Boss
        for (let i = this.boss.segments.length - 1; i >= 0; i--) {
            const seg = this.boss.segments[i];
            const segSize = this.boss.size * (0.85 - (i * 0.08));
            ctx.fillStyle = this.boss.phase === 2 ? '#c0392b' : '#8e44ad';
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Renderizar cabeça do Boss
        const now = Date.now();
        const isHurt = now < this.boss.hurtUntil;
        const isVulnerable = this.boss.state === 'vulnerable';

        ctx.save();
        if (isHurt) {
            ctx.fillStyle = '#ffffff';
        } else if (isVulnerable) {
            ctx.fillStyle = '#f1c40f'; // Dourado brilhante quando vulnerável
            ctx.shadowColor = '#f1c40f';
            ctx.shadowBlur = 20;
        } else {
            ctx.fillStyle = this.boss.phase === 2 ? '#e74c3c' : '#9b59b6';
            ctx.shadowColor = '#e74c3c';
            ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.arc(this.boss.x, this.boss.y, this.boss.size, 0, Math.PI * 2);
        ctx.fill();

        // Olhos ferozes do Boss
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(this.boss.x - 12, this.boss.y - 8, 6, 0, Math.PI * 2);
        ctx.arc(this.boss.x + 12, this.boss.y - 8, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.boss.x - 12, this.boss.y - 8, 3, 0, Math.PI * 2);
        ctx.arc(this.boss.x + 12, this.boss.y - 8, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Renderizar itens e lacaios
        this.items.renderAll(ctx);
        this.enemies.renderAll(ctx);

        // Renderizar cobra do jogador
        snake.render(ctx);
    }

    cleanup() {
        this.enemies.clear();
        this.items.clear();
    }
}
