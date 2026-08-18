/**
 * Combat System
 * Gerencia colisões, cálculos de dano, tiros e combate com inimigos e chefão
 */

class CombatSystem {
    constructor() {
        this.damageMultiplier = 1;
        this.isInvincible = false;
        this.invincibleUntil = 0;
    }

    activateInvincibility(duration) {
        this.isInvincible = true;
        this.invincibleUntil = Date.now() + duration;
    }

    update() {
        if (this.isInvincible && Date.now() >= this.invincibleUntil) {
            this.isInvincible = false;
        }
    }

    /**
     * Processa colisões de projéteis com inimigos, boss e jogador
     */
    processProjectiles(projectiles, enemies, boss, snake) {
        const projs = projectiles.getAll();

        for (let i = projs.length - 1; i >= 0; i--) {
            const p = projs[i];
            if (p.isDead) continue;

            const pGrid = p.getGridPosition();

            if (p.isPlayer) {
                // Projétil do jogador atingindo inimigos comuns
                if (enemies) {
                    const activeEnemies = enemies.getAll();
                    for (const enemy of activeEnemies) {
                        if (enemy.gridX === pGrid.gridX && enemy.gridY === pGrid.gridY) {
                            enemy.takeDamage(p.damage);
                            p.isDead = true;
                            if (typeof sfx !== 'undefined') sfx.playHit();
                            if (enemy.isDead) {
                                snake.gainXP(enemy.xpReward);
                                snake.enemiesDefeated++;
                                // Chance de drop de item
                                if (window.game && window.game.currentStageObject && window.game.currentStageObject.items) {
                                    window.game.currentStageObject.items.spawnRandomItem(enemy.gridX, enemy.gridY);
                                }
                            }
                            break;
                        }
                    }
                }

                // Projétil do jogador atingindo o Boss
                if (boss && !boss.isDead && !p.isDead) {
                    if (boss.checkHit(p.x, p.y, p.damage)) {
                        p.isDead = true;
                        if (typeof sfx !== 'undefined') sfx.playHit();
                    }
                }
            } else {
                // Projétil inimigo atingindo o jogador
                if (snake) {
                    const head = snake.getHeadPosition();
                    // Checar colisão com a cabeça ou corpo da cobra
                    let hit = false;
                    for (const segment of snake.body) {
                        if (segment.gridX === pGrid.gridX && segment.gridY === pGrid.gridY) {
                            hit = true;
                            break;
                        }
                    }
                    if (hit) {
                        snake.takeDamage(p.damage, 'Atingido por disparo inimigo!');
                        p.isDead = true;
                    }
                }
            }
        }
    }

    /**
     * Resolve colisão direta da cabeça da cobra com inimigos
     */
    resolveSnakeEnemyCollision(snake, enemy) {
        if (!snake || !enemy || enemy.isDead) return;

        // Se a habilidade Devorar estiver ativa, a cobra engole o monstro por inteiro!
        if (snake.isDevourActive) {
            enemy.takeDamage(999);
            snake.devourEnemy(enemy);
            if (window.game && window.game.currentStageObject && window.game.currentStageObject.items) {
                window.game.currentStageObject.items.spawnRandomItem(enemy.gridX, enemy.gridY);
            }
            return;
        }

        if (this.isInvincible || snake.isDashing) {
            // Em dash ou invencível, atropela o inimigo!
            enemy.takeDamage(5);
            if (typeof sfx !== 'undefined') sfx.playHit();
            if (enemy.isDead) {
                snake.gainXP(enemy.xpReward);
                snake.enemiesDefeated++;
                if (window.game && window.game.currentStageObject && window.game.currentStageObject.items) {
                    window.game.currentStageObject.items.spawnRandomItem(enemy.gridX, enemy.gridY);
                }
            }
        } else {
            snake.takeDamage(1, 'Colidiu com monstro!');
            enemy.takeDamage(1);
        }
    }

    /**
     * Resolve colisão com item
     */
    resolveSnakeItemCollision(snake, item) {
        const value = item.collect();
        snake.itemsCollected++;
        snake.grow(1);

        switch (item.type) {
            case 'xp':
                snake.gainXP(value);
                break;
            case 'heal':
                snake.heal(value);
                break;
            case 'fury':
                snake.damageBuff = true;
                snake.damageBuffUntil = Date.now() + value;
                if (typeof hud !== 'undefined' && hud.showMessage) {
                    hud.showMessage('🔥 FÚRIA ATIVADA! Dano Duplo nos Tiros!', 2000);
                }
                break;
            case 'shield':
                snake.hasShield = true;
                snake.shieldUntil = Date.now() + value;
                break;
            case 'magnet':
                snake.isMagnetActive = true;
                snake.magnetUntil = Date.now() + value;
                break;
        }
    }
}

const combatSystem = new CombatSystem();
