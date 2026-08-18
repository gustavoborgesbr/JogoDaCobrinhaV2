/**
 * Save System
 * Gerencia persistência em localStorage (XP, níveis, upgrades e fases desbloqueadas)
 */

class SaveSystem {
    constructor() {
        this.storageKey = 'cobrinha_rpg_save_v2';
        this.defaultSave = {
            totalXP: 0,
            playerLevel: 1,
            skillPoints: 0,
            unlockedStage: 1,
            highScore: 0,
            selectedSkin: 'emerald',
            upgrades: {
                maxHp: 0,         // +1 Vida por nível (max 5)
                damage: 0,        // +1 Dano no disparo (max 5)
                dashCooldown: 0,  // -15% tempo de recarga do dash (max 4)
                shieldDuration: 0,// +0.5s duração de escudo (max 4)
                magnetRadius: 0,  // +40px raio de atração (max 4)
                speed: 0          // +10% velocidade de movimento (max 3)
            }
        };

        this.load();
        if (typeof spriteManager !== 'undefined' && this.data.selectedSkin) {
            spriteManager.setSkin(this.data.selectedSkin);
        }
    }

    /**
     * Carrega dados do localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.data = {
                    ...this.defaultSave,
                    ...parsed,
                    upgrades: { ...this.defaultSave.upgrades, ...(parsed.upgrades || {}) }
                };

                // Sanitização contra valores corrompidos por loops anteriores
                if (typeof this.data.playerLevel !== 'number' || isNaN(this.data.playerLevel) || this.data.playerLevel > 100 || this.data.playerLevel < 1) {
                    this.data.playerLevel = 1;
                }
                if (typeof this.data.skillPoints !== 'number' || isNaN(this.data.skillPoints) || this.data.skillPoints > 150 || this.data.skillPoints < 0) {
                    this.data.skillPoints = Math.max(0, this.data.playerLevel - 1);
                }
                if (typeof this.data.totalXP !== 'number' || isNaN(this.data.totalXP) || this.data.totalXP < 0) {
                    this.data.totalXP = 0;
                }
            } else {
                this.data = JSON.parse(JSON.stringify(this.defaultSave));
            }
        } catch (e) {
            console.error('Erro ao ler save:', e);
            this.data = JSON.parse(JSON.stringify(this.defaultSave));
        }
        return this.data;
    }

    /**
     * Reseta todo o progresso do jogo e recarrega a página.
     */
    resetData() {
        try {
            localStorage.removeItem(this.storageKey);
            this.data = JSON.parse(JSON.stringify(this.defaultSave));
            this.save();
            location.reload();
        } catch (e) {
            console.error('Erro ao resetar save:', e);
        }
    }

    /**
     * Salva dados no localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Erro ao gravar save:', e);
        }
    }

    /**
     * Adiciona XP permanente e calcula subida de nível geral de forma segura e progressiva
     */
    addPermanentXP(amount) {
        if (!amount || typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
        this.data.totalXP = (this.data.totalXP || 0) + amount;

        let leveledUp = false;
        let maxIterations = 20; // Trava de segurança absoluta

        while (maxIterations > 0) {
            const xpNeeded = this.data.playerLevel * 250;
            if (this.data.totalXP >= xpNeeded && this.data.playerLevel < 100) {
                this.data.totalXP -= xpNeeded;
                this.data.playerLevel++;
                this.data.skillPoints++;
                leveledUp = true;
                maxIterations--;
            } else {
                break;
            }
        }

        if (leveledUp && typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage(`⭐ Subiu de Nível de Herói! Nvl ${this.data.playerLevel} (+Pontos de Talento)`, 3000);
        }
        this.save();
    }

    /**
     * Tenta comprar upgrade com pontos de habilidade
     */
    buyUpgrade(upgradeKey) {
        const costs = {
            maxHp: 1,
            damage: 1,
            dashCooldown: 1,
            shieldDuration: 1,
            magnetRadius: 1,
            speed: 1
        };
        const maxLevels = {
            maxHp: 5,
            damage: 5,
            dashCooldown: 4,
            shieldDuration: 4,
            magnetRadius: 4,
            speed: 3
        };

        const cost = costs[upgradeKey] || 1;
        const maxLvl = maxLevels[upgradeKey] || 5;
        const currentLvl = this.data.upgrades[upgradeKey] || 0;

        if (currentLvl >= maxLvl) return { success: false, reason: 'Nível máximo atingido!' };
        if (this.data.skillPoints < cost) return { success: false, reason: 'Pontos de habilidade insuficientes!' };

        this.data.skillPoints -= cost;
        this.data.upgrades[upgradeKey] = currentLvl + 1;
        this.save();
        return { success: true };
    }

    /**
     * Desbloqueia fase seguinte
     */
    unlockNextStage(stageNumber) {
        if (stageNumber > this.data.unlockedStage) {
            this.data.unlockedStage = stageNumber;
            this.save();
        }
    }

    /**
     * Atualiza recorde de pontuação
     */
    updateHighScore(score) {
        if (score > this.data.highScore) {
            this.data.highScore = score;
            this.save();
        }
    }

    get(key) {
        return this.data[key];
    }

    getUpgrades() {
        return this.data.upgrades;
    }

    setSkin(skinName) {
        this.data.selectedSkin = skinName;
        this.save();
        if (typeof spriteManager !== 'undefined') {
            spriteManager.setSkin(skinName);
        }
    }

    clear() {
        localStorage.removeItem(this.storageKey);
        this.data = JSON.parse(JSON.stringify(this.defaultSave));
        this.save();
    }
}

const saveSystem = new SaveSystem();
