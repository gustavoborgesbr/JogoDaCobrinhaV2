/**
 * Combat System
 * Gerencia colisões e combate entre entidades
 */

class CombatSystem {
    constructor() {
        this.damageMultiplier = 1;
        this.isInvincible = false;
        this.invincibleUntil = 0;
    }

    /**
     * Ativa modo invencível por um tempo
     */
    activateInvincibility(duration) {
        this.isInvincible = true;
        this.invincibleUntil = Date.now() + duration;
    }

    /**
     * Atualiza estado de invencibilidade
     */
    update() {
        if (this.isInvincible && Date.now() >= this.invincibleUntil) {
            this.isInvincible = false;
        }
    }

    /**
     * Verifica colisão cobra x inimigo
     */
    checkSnakeEnemyCollision(snake, enemy) {
        const snakeHead = snake.getHeadPosition();
        const enemyPos = enemy.getPosition();

        return snakeHead.gridX === enemyPos.gridX && snakeHead.gridY === enemyPos.gridY;
    }

    /**
     * Resolve colisão cobra x inimigo
     */
    resolveSnakeEnemyCollision(snake, enemy) {
        if (this.isInvincible) {
            // Em invencibilidade, derrota inimigo
            enemy.takeDamage(1);
            if (enemy.isDead) {
                snake.gainXP(enemy.xpReward);
            }
        } else {
            // Sem invencibilidade, cobra toma dano
            snake.takeDamage(1);
        }
    }

    /**
     * Verifica colisão cobra x item
     */
    checkSnakeItemCollision(snake, item) {
        const snakeHead = snake.getHeadPosition();
        const itemPos = item.getPosition();

        return snakeHead.gridX === itemPos.gridX && snakeHead.gridY === itemPos.gridY;
    }

    /**
     * Resolve colisão cobra x item
     */
    resolveSnakeItemCollision(snake, item) {
        const value = item.collect();

        switch (item.type) {
            case 'xp':
                snake.gainXP(value);
                break;
            case 'heal':
                snake.heal(value);
                break;
            case 'speed':
                // TODO: Implementar buff de velocidade temporário
                console.log('⚡ Buff de velocidade ativado!');
                break;
            case 'invincible':
                this.activateInvincibility(value);
                console.log('🛡️ Invencibilidade ativada!');
                break;
        }
    }

    /**
     * Aplica dano com multiplicador
     */
    calculateDamage(baseDamage) {
        return Math.floor(baseDamage * this.damageMultiplier);
    }

    /**
     * Define multiplicador de dano (para skills)
     */
    setDamageMultiplier(multiplier) {
        this.damageMultiplier = multiplier;
    }
}

// Criar instância global
const combatSystem = new CombatSystem();
