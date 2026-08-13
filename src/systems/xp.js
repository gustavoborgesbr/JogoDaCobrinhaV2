/**
 * XP System
 * Gerencia ganho de experiência e leveling
 */

class XPSystem {
    constructor() {
        this.xpTable = {
            1: 100,
            2: 150,
            3: 225,
            4: 338,
            5: 507,
            6: 760,
            7: 1140,
            8: 1710,
            9: 2565,
            10: 3847
        };
    }

    /**
     * Calcula XP necessário para próximo nível
     */
    getXPForNextLevel(currentLevel) {
        const nextLevel = currentLevel + 1;
        if (this.xpTable[nextLevel]) {
            return this.xpTable[nextLevel];
        }
        // Fórmula para níveis além da tabela
        return Math.floor(100 * Math.pow(nextLevel, 1.5));
    }

    /**
     * Calcula XP por tipo de fonte
     */
    calculateXP(source, difficulty = 1) {
        const baseXP = {
            'enemy_basic': 50,
            'enemy_fast': 100,
            'enemy_smart': 200,
            'item_common': 50,
            'item_rare': 150,
            'item_epic': 500,
            'boss': 1000
        };

        const xp = baseXP[source] || 0;
        return Math.floor(xp * difficulty);
    }

    /**
     * Retorna porcentagem de progresso para próximo nível
     */
    getProgressPercent(currentXP, xpNeeded) {
        return Math.min(100, Math.floor((currentXP / xpNeeded) * 100));
    }
}

// Criar instância global
const xpSystem = new XPSystem();
