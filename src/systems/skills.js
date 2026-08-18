/**
 * Skills System
 * Gerencia habilidades ativas:
 * - Q: Disparo de Projétil
 * - W: Dash com aceleração e invencibilidade
 * - E: Escudo protetor / Barreira
 * - R: Magnetismo / Atração de itens
 */

class Skill {
    constructor(id, name, key, cooldown, duration = 0, icon = '⚡') {
        this.id = id;
        this.name = name;
        this.key = key;
        this.baseCooldown = cooldown; // ms
        this.cooldown = cooldown;
        this.baseDuration = duration; // ms
        this.duration = duration;
        this.lastUsed = -cooldown;    // Permite uso inicial imediato
        this.isActive = false;
        this.activeUntil = 0;
        this.icon = icon;
    }

    applyUpgrades(upgrades = {}) {
        if (this.id === 'dash' && upgrades.dashCooldown) {
            this.cooldown = this.baseCooldown * (1 - upgrades.dashCooldown * 0.12);
        }
        if (this.id === 'shield' && upgrades.shieldDuration) {
            this.duration = this.baseDuration + (upgrades.shieldDuration * 500);
        }
    }

    canUse() {
        return Date.now() - this.lastUsed >= this.cooldown;
    }

    use() {
        if (!this.canUse()) return false;

        this.lastUsed = Date.now();
        this.isActive = true;
        this.activeUntil = Date.now() + this.duration;
        return true;
    }

    update() {
        if (this.isActive && Date.now() >= this.activeUntil) {
            this.isActive = false;
        }
    }

    getRemainingCooldown() {
        const remaining = this.cooldown - (Date.now() - this.lastUsed);
        return Math.max(0, remaining);
    }

    getCooldownPercent() {
        if (this.canUse()) return 0;
        const remaining = this.getRemainingCooldown();
        return Math.min(100, Math.floor((remaining / this.cooldown) * 100));
    }
}

class SkillsSystem {
    constructor() {
        this.skills = {
            shoot: new Skill('shoot', 'Tiro', 'Q', 300, 0, '🎯'),
            dash: new Skill('dash', 'Dash', 'W', 2200, 350, '💨'),
            shield: new Skill('shield', 'Escudo', 'E', 4500, 2500, '🛡️'),
            magnet: new Skill('magnet', 'Magnetismo', 'R', 5000, 3000, '🧲'),
            devour: new Skill('devour', 'Devorar', 'T/Espaço', 6000, 4000, '🦷')
        };
    }

    init() {
        const upgrades = saveSystem.getUpgrades();
        Object.values(this.skills).forEach(s => s.applyUpgrades(upgrades));
    }

    activateSkill(skillName, snake) {
        const skill = this.skills[skillName];
        if (!skill || !skill.canUse()) return false;

        if (skillName === 'shoot') {
            if (!snake) return false;
            skill.use();
            this.executeShoot(snake);
            return true;
        }

        if (skillName === 'dash') {
            if (!snake) return false;
            skill.use();
            this.executeDash(snake);
            return true;
        }

        if (skillName === 'shield') {
            if (!snake) return false;
            skill.use();
            this.executeShield(snake);
            return true;
        }

        if (skillName === 'magnet') {
            if (!snake) return false;
            skill.use();
            this.executeMagnet(snake);
            return true;
        }

        if (skillName === 'devour') {
            if (!snake) return false;
            skill.use();
            this.executeDevour(snake);
            return true;
        }

        return false;
    }

    executeShoot(snake) {
        if (typeof sfx !== 'undefined') sfx.playShoot();
        const head = snake.getHeadPosition();
        const pixelPos = grid.gridToPixels(head.gridX, head.gridY);
        const centerX = pixelPos.pixelX + grid.cellSize / 2;
        const centerY = pixelPos.pixelY + grid.cellSize / 2;

        let dirX = snake.direction.x;
        let dirY = snake.direction.y;
        if (dirX === 0 && dirY === 0) dirX = 1;

        const speed = 400;
        const vx = dirX * speed;
        const vy = dirY * speed;

        const upgrades = saveSystem.getUpgrades();
        const damage = 1 + (upgrades.damage || 0) + (snake.damageBuff ? 1 : 0);

        projectilePool.spawn(centerX, centerY, vx, vy, true, damage, '#2ecc71', 6);
        particleSystem.createExplosion(centerX, centerY, '#2ecc71', 6);
    }

    executeDash(snake) {
        if (typeof sfx !== 'undefined') sfx.playDash();
        snake.isDashing = true;
        snake.dashUntil = Date.now() + this.skills.dash.duration;
        combatSystem.activateInvincibility(this.skills.dash.duration + 100);

        const head = snake.getHeadPosition();
        const pixelPos = grid.gridToPixels(head.gridX, head.gridY);
        particleSystem.createExplosion(pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY + grid.cellSize / 2, '#3498db', 14);
        particleSystem.createFloatingText('DASH!', pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY, '#3498db');
    }

    executeShield(snake) {
        if (typeof sfx !== 'undefined') sfx.playShield();
        snake.hasShield = true;
        snake.shieldUntil = Date.now() + this.skills.shield.duration;

        const head = snake.getHeadPosition();
        const pixelPos = grid.gridToPixels(head.gridX, head.gridY);
        particleSystem.createExplosion(pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY + grid.cellSize / 2, '#f1c40f', 16);
        particleSystem.createFloatingText('ESCUDO!', pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY, '#f1c40f');
    }

    executeMagnet(snake) {
        if (typeof sfx !== 'undefined') sfx.playItemCollect();
        snake.isMagnetActive = true;
        snake.magnetUntil = Date.now() + this.skills.magnet.duration;

        const head = snake.getHeadPosition();
        const pixelPos = grid.gridToPixels(head.gridX, head.gridY);
        particleSystem.createExplosion(pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY + grid.cellSize / 2, '#9b59b6', 16);
        particleSystem.createFloatingText('MAGNETISMO!', pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY, '#9b59b6');
    }

    executeDevour(snake) {
        if (typeof sfx !== 'undefined') sfx.playBite();
        snake.isDevourActive = true;
        snake.devourUntil = Date.now() + this.skills.devour.duration;

        const head = snake.getHeadPosition();
        const pixelPos = grid.gridToPixels(head.gridX, head.gridY);
        particleSystem.createExplosion(pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY + grid.cellSize / 2, '#ef4444', 20);
        particleSystem.createFloatingText('🦷 MODO DEVORADOR!', pixelPos.pixelX + grid.cellSize / 2, pixelPos.pixelY - 10, '#f87171');
        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage('🦷 FAUCE DEVORADORA ATIVADA! Devore os monstros no caminho!', 2200);
        }
    }

    updateAll() {
        Object.values(this.skills).forEach(skill => skill.update());
    }

    getStatus() {
        const status = {};
        for (const [name, skill] of Object.entries(this.skills)) {
            status[name] = {
                name: skill.name,
                key: skill.key,
                icon: skill.icon,
                active: skill.isActive,
                cooldownPercent: skill.getCooldownPercent(),
                canUse: skill.canUse(),
                remainingSec: (skill.getRemainingCooldown() / 1000).toFixed(1)
            };
        }
        return status;
    }
}

const skillsSystem = new SkillsSystem();
