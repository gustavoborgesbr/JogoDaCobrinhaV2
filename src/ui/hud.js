/**
 * HUD - Heads Up Display
 * Exibe status em tempo real (HP, XP, Nível, Objetivo da Fase e Habilidades Q, W, E, R)
 */

class HUD {
    constructor() {
        this.hudElement = document.getElementById('hud');
        this.updateRate = 60; // ms
        this.lastUpdate = Date.now();
    }

    update(snake) {
        const now = Date.now();
        if (now - this.lastUpdate < this.updateRate) return;
        this.lastUpdate = now;

        if (!snake || !this.hudElement) return;

        const health = snake.health;
        const maxHealth = snake.maxHealth;
        const hpPercent = Math.max(0, Math.floor((health / maxHealth) * 100));

        const level = snake.level;
        const xp = snake.xp;
        const xpNeeded = snake.xpToNextLevel;
        const xpPercent = Math.min(100, Math.floor((xp / xpNeeded) * 100));

        let missionHtml = '';
        if (window.game && window.game.currentStageObject) {
            const stage = window.game.currentStageObject;
            if (stage.name === 'O Covil do Grande Dragão') {
                const bossHp = stage.boss ? stage.boss.hp : 0;
                const bossMax = stage.boss ? stage.boss.maxHp : 100;
                missionHtml = `
                    <div class="mission-header">👑 Derrotar o Dragão</div>
                    <div class="mission-item">
                        <span class="mission-icon">🔥</span>
                        <span class="mission-text">Vida: ${Math.max(0, bossHp)}/${bossMax}</span>
                    </div>
                `;
            } else {
                const curItems = Math.min(snake.itemsCollected, stage.targetItems || 0);
                const curEnemies = Math.min(snake.enemiesDefeated, stage.targetEnemies || 0);
                const maxItems = stage.targetItems || 0;
                const maxEnemies = stage.targetEnemies || 0;
                const itemsDone = curItems >= maxItems;
                const enemiesDone = curEnemies >= maxEnemies;
                
                const itemIcon = window.game.currentStage === 1 ? '🍎' : '💎';
                const itemName = window.game.currentStage === 1 ? 'Maçãs' : 'Cristais';

                missionHtml = `
                    <div class="mission-header">📜 Objetivos da Fase</div>
                    <div class="mission-list">
                        <div class="mission-item ${itemsDone ? 'done' : ''}">
                            <span class="mission-icon">${itemIcon}</span>
                            <span class="mission-text">${itemName}: ${curItems}/${maxItems}</span>
                        </div>
                        <div class="mission-item ${enemiesDone ? 'done' : ''}">
                            <span class="mission-icon">⚔️</span>
                            <span class="mission-text">Monstros: ${curEnemies}/${maxEnemies}</span>
                        </div>
                    </div>
                    ${(itemsDone && enemiesDone) ? '<div class="mission-portal-msg pulse">✨ Encontre o Portal!</div>' : ''}
                `;
            }
        }

        const skillsStatus = skillsSystem.getStatus();

        this.hudElement.innerHTML = `
            <div class="hud-container">
                <!-- Status da Cobra (HP & XP) -->
                <div class="hud-stats-group">
                    <div class="hud-bar-wrapper">
                        <div class="hud-label"><span>❤️ VIDA</span> <span>${health}/${maxHealth}</span></div>
                        <div class="hud-progress-bg">
                            <div class="hud-progress-fill hp-fill" style="width: ${hpPercent}%"></div>
                        </div>
                    </div>

                    <div class="hud-bar-wrapper">
                        <div class="hud-label"><span>⭐ NVL ${level}</span> <span>${xp}/${xpNeeded} XP</span></div>
                        <div class="hud-progress-bg">
                            <div class="hud-progress-fill xp-fill" style="width: ${xpPercent}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Objetivo da Fase / Boss -->
                <div class="hud-goal-card mission-card">
                    ${missionHtml}
                </div>

                <!-- Habilidades Q, W, E, R, T -->
                <div class="hud-skills-group">
                    <div class="skill-slot ${skillsStatus.shoot?.canUse ? 'ready' : 'cooldown'}" onpointerdown="input.triggerSkill('shoot')" title="Disparar Projétil Mágico (Q)">
                        <span class="skill-key">Q</span>
                        <span class="skill-icon">🎯</span>
                        ${!skillsStatus.shoot?.canUse ? `<div class="skill-cooldown-overlay" style="height: ${skillsStatus.shoot.cooldownPercent}%"></div>` : ''}
                    </div>

                    <div class="skill-slot ${skillsStatus.dash?.canUse ? 'ready' : 'cooldown'}" onpointerdown="input.triggerSkill('dash')" title="Dash de Velocidade (Shift)">
                        <span class="skill-key">Shift</span>
                        <span class="skill-icon">💨</span>
                        ${!skillsStatus.dash?.canUse ? `<div class="skill-cooldown-overlay" style="height: ${skillsStatus.dash.cooldownPercent}%"></div>` : ''}
                    </div>

                    <div class="skill-slot ${skillsStatus.shield?.canUse ? 'ready' : 'cooldown'}" onpointerdown="input.triggerSkill('shield')" title="Escudo Sagrado (E)">
                        <span class="skill-key">E</span>
                        <span class="skill-icon">🛡️</span>
                        ${!skillsStatus.shield?.canUse ? `<div class="skill-cooldown-overlay" style="height: ${skillsStatus.shield.cooldownPercent}%"></div>` : ''}
                    </div>

                    <div class="skill-slot ${skillsStatus.magnet?.canUse ? 'ready' : 'cooldown'}" onpointerdown="input.triggerSkill('magnet')" title="Magnetismo Arcano (R)">
                        <span class="skill-key">R</span>
                        <span class="skill-icon">🧲</span>
                        ${!skillsStatus.magnet?.canUse ? `<div class="skill-cooldown-overlay" style="height: ${skillsStatus.magnet.cooldownPercent}%"></div>` : ''}
                    </div>

                    <div class="skill-slot devour-slot ${skillsStatus.devour?.canUse ? 'ready' : 'cooldown'}" onpointerdown="input.triggerSkill('devour')" title="Fauce Devoradora - Comer Inimigos (T / Espaço)">
                        <span class="skill-key">T/Espaço</span>
                        <span class="skill-icon">🦷</span>
                        ${!skillsStatus.devour?.canUse ? `<div class="skill-cooldown-overlay" style="height: ${skillsStatus.devour.cooldownPercent}%"></div>` : ''}
                    </div>
                </div>

                <!-- Botões de Controle Rápido & Música -->
                <div class="hud-controls-group">
                    <button class="hud-control-btn" onpointerdown="menuSystem.toggleMusic()" id="btn-hud-music" title="Alternar Música (M)">🎵</button>
                    <button class="hud-control-btn" onpointerdown="if(window.game) window.game.pause();" title="Pausar Jogo (ESC)">⏸️</button>
                    <button class="hud-control-btn" onpointerdown="menuSystem.toggleFullscreen()" title="Tela Cheia (F)">⛶</button>
                </div>
            </div>
        `;
    }

    showMessage(text, duration = 2000) {
        const existing = document.querySelectorAll('.game-banner-msg');
        existing.forEach(e => e.remove());

        const msg = document.createElement('div');
        msg.className = 'game-banner-msg';
        msg.textContent = text;
        msg.style.cssText = `
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 23, 42, 0.92);
            border: 2px solid #2ecc71;
            color: #ffffff;
            padding: 12px 28px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 0.5px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.7);
            z-index: 500;
            pointer-events: none;
            animation: fadeInDown 0.3s ease;
        `;

        document.getElementById('game-container').appendChild(msg);
        setTimeout(() => msg.remove(), duration);
    }
}

const hud = new HUD();
