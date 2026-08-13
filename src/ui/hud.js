/**
 * HUD - Heads Up Display
 * Exibe informações em tempo real (XP, vida, nível, skills)
 */

class HUD {
    constructor() {
        this.hudElement = document.getElementById('hud');
        this.updateRate = 100; // ms
        this.lastUpdate = Date.now();
    }

    /**
     * Atualiza HUD na tela
     */
    update(snake) {
        const now = Date.now();
        if (now - this.lastUpdate < this.updateRate) return;

        this.lastUpdate = now;

        // Construir conteúdo
        const level = snake.level;
        const xp = snake.xp;
        const xpNeeded = snake.xpToNextLevel;
        const xpPercent = xpSystem.getProgressPercent(xp, xpNeeded);
        const health = snake.health;
        const maxHealth = snake.maxHealth;

        const content = `
            <div style="display: flex; gap: 30px; width: 100%;">
                <div>❤️ Vida: ${health}/${maxHealth}</div>
                <div>⭐ Nível: ${level}</div>
                <div>💎 XP: ${xp}/${xpNeeded} (${xpPercent}%)</div>
                <div style="flex-grow: 1; text-align: right;">🐉 Fase: ${window.game?.currentStage || 1}</div>
            </div>
        `;

        this.hudElement.innerHTML = content;
    }

    /**
     * Mostra mensagem temporária
     */
    showMessage(text, duration = 2000) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 24px;
            z-index: 500;
        `;

        document.getElementById('game-container').appendChild(msg);

        setTimeout(() => msg.remove(), duration);
    }

    /**
     * Mostra aviso (texto vermelho)
     */
    showWarning(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(231, 76, 60, 0.9);
            color: #fff;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 24px;
            z-index: 500;
            animation: pulse 0.5s infinite;
        `;

        document.getElementById('game-container').appendChild(msg);

        setTimeout(() => msg.remove(), 2000);
    }
}

// Criar instância global
const hud = new HUD();
