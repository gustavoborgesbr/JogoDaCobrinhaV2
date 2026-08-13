/**
 * Skills System
 * Gerencia habilidades ativas e cooldowns
 */

class Skill {
    constructor(name, cooldown, duration = 0) {
        this.name = name;
        this.cooldown = cooldown;      // ms entre uses
        this.duration = duration;      // ms de duração do efeito (0 = instantâneo)
        this.lastUsed = -cooldown;     // Permite uso imediato
        this.isActive = false;
        this.activeUntil = 0;
    }

    /**
     * Verifica se skill pode ser usada
     */
    canUse() {
        return Date.now() - this.lastUsed >= this.cooldown;
    }

    /**
     * Usa a skill
     */
    use() {
        if (!this.canUse()) return false;

        this.lastUsed = Date.now();
        this.isActive = true;
        this.activeUntil = Date.now() + this.duration;

        console.log(`⚡ ${this.name} ativada!`);
        return true;
    }

    /**
     * Atualiza estado (verifica se duração terminou)
     */
    update() {
        if (this.isActive && Date.now() >= this.activeUntil) {
            this.isActive = false;
        }
    }

    /**
     * Retorna cooldown restante em ms
     */
    getRemainingCooldown() {
        const remaining = this.cooldown - (Date.now() - this.lastUsed);
        return Math.max(0, remaining);
    }

    /**
     * Retorna porcentagem de cooldown (0-100)
     */
    getCooldownPercent() {
        const remaining = this.getRemainingCooldown();
        return Math.floor((remaining / this.cooldown) * 100);
    }
}

/**
 * Sistema de habilidades
 */
class SkillsSystem {
    constructor() {
        this.skills = {
            dash: new Skill('Dash', 2000, 300),           // Cooldown 2s, duração 300ms
            shield: new Skill('Escudo', 3000, 2000),      // Cooldown 3s, duração 2s
            areaAttack: new Skill('Ataque em Área', 4000), // Cooldown 4s
            wallPass: new Skill('Atravessar Parede', 5000) // Cooldown 5s
        };
    }

    /**
     * Ativa skill por nome
     */
    activateSkill(skillName) {
        if (this.skills[skillName]) {
            return this.skills[skillName].use();
        }
        return false;
    }

    /**
     * Atualiza todos os cooldowns
     */
    updateAll() {
        Object.values(this.skills).forEach(skill => skill.update());
    }

    /**
     * Retorna estado de todas as skills
     */
    getStatus() {
        const status = {};
        for (const [name, skill] of Object.entries(this.skills)) {
            status[name] = {
                active: skill.isActive,
                cooldownPercent: skill.getCooldownPercent(),
                canUse: skill.canUse()
            };
        }
        return status;
    }

    /**
     * Retorna dados para rendering no HUD
     */
    getHUDData() {
        const data = [];
        for (const [name, skill] of Object.entries(this.skills)) {
            data.push({
                name: name,
                cooldownPercent: skill.getCooldownPercent()
            });
        }
        return data;
    }
}

// Criar instância global
const skillsSystem = new SkillsSystem();
