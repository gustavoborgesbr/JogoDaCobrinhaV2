/**
 * Menus
 * Telas do jogo: Menu Principal, Seleção de Fases, Árvore de Talentos/Melhorias,
 * Pausa, Game Over e Vitória
 */

class MenuSystem {
    constructor() {
        this.currentMenu = 'main';
        this.createMenus();
    }

    createMenus() {
        const container = document.getElementById('game-container');

        // Menu Principal
        const mainMenu = document.createElement('div');
        mainMenu.id = 'menu-main';
        mainMenu.className = 'menu active';
        mainMenu.innerHTML = `
            <div class="menu-card transparent">
                <div class="menu-header-row">
                    <div class="game-logo-badge">RPG ARCADE</div>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-icon-fullscreen" onclick="menuSystem.toggleMusic()" id="btn-menu-music-toggle" title="Alternar Música (M)">🎵</button>
                        <button class="btn-icon-fullscreen" onclick="menuSystem.toggleFullscreen()" title="Alternar Tela Cheia (F)">⛶</button>
                    </div>
                </div>
                <h1 class="game-title"><img src="assets/snake.png" class="title-snake-icon" alt="Snake"> Cobrinha RPG</h1>
                <p class="game-subtitle">Evolua sua cobra, domine magias e conquiste o Templo da Serpente!</p>

                <!-- Track info badge -->
                <div class="menu-music-badge" id="menu-music-badge">
                    <span class="music-note-anim">🎶</span>
                    <span id="menu-music-title">Templo da Serpente Ancestral</span>
                </div>

                <div class="menu-btn-group">
                    <button class="btn-primary" onclick="menuSystem.promptDifficulty(1)">▶ Iniciar Partida</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('stages')">🗺️ Selecionar Fase</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('talents')">✨ Árvore de Melhorias</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('settings')">⚙️ Áudio & Opções</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('about')">ℹ️ Como Jogar</button>
                </div>
            </div>
        `;
        container.appendChild(mainMenu);

        // Menu Configurações de Áudio
        const settingsMenu = document.createElement('div');
        settingsMenu.id = 'menu-settings';
        settingsMenu.className = 'menu';
        settingsMenu.innerHTML = `
            <div class="menu-card">
                <h2>⚙️ Configurações de Áudio</h2>
                <div class="audio-settings-box">
                    <div class="audio-control-row">
                        <span>🎵 Música Chiptune</span>
                        <button class="btn-toggle-audio active" id="btn-setting-music" onclick="menuSystem.toggleMusic()">LIGADA</button>
                    </div>
                    <div class="audio-slider-row">
                        <label>Volume da Música: <strong id="val-music-volume">55%</strong></label>
                        <input type="range" min="0" max="100" value="55" class="audio-slider" id="slider-music" oninput="menuSystem.setMusicVolume(this.value)">
                    </div>

                    <div class="audio-control-row" style="margin-top: 15px;">
                        <span>🔊 Efeitos Sonoros (SFX)</span>
                        <button class="btn-toggle-audio active" id="btn-setting-sfx" onclick="menuSystem.toggleSFX()">LIGADO</button>
                    </div>
                    <div class="audio-slider-row">
                        <label>Volume dos Efeitos: <strong id="val-sfx-volume">70%</strong></label>
                        <input type="range" min="0" max="100" value="70" class="audio-slider" id="slider-sfx" oninput="menuSystem.setSFXVolume(this.value)">
                    </div>
                </div>
                
                <div class="danger-zone-box" style="margin-top: 25px; padding: 15px; border: 1.5px solid rgba(239, 68, 68, 0.4); border-radius: 12px; background: rgba(239, 68, 68, 0.08);">
                    <h3 style="color: #f87171; font-size: 14px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">Zona de Perigo</h3>
                    <p style="color: #fca5a5; font-size: 12px; margin-bottom: 15px; line-height: 1.4;">Isso apagará todo o seu XP, melhorias e fases desbloqueadas. <strong>Esta ação não pode ser desfeita.</strong></p>
                    <button class="btn-danger" style="width: 100%; padding: 12px; border-radius: 8px; font-weight: 700; background: linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(239, 68, 68, 0.9)); color: white; border: 1px solid rgba(248, 113, 113, 0.5); cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-family: var(--font-body); font-size: 14px; transition: all 0.2s ease;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 15px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'" onclick="menuSystem.resetProgress()">⚠️ Apagar Progresso Salvo</button>
                </div>

                <div style="margin-top: 25px;">
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">⬅ Voltar ao Menu</button>
                </div>
            </div>
        `;
        container.appendChild(settingsMenu);

        // Menu Seleção de Fases
        const stagesMenu = document.createElement('div');
        stagesMenu.id = 'menu-stages';
        stagesMenu.className = 'menu';
        stagesMenu.innerHTML = `
            <div class="menu-card large">
                <h2>🗺️ Seleção de Fases</h2>
                <div class="stages-grid" id="stages-grid-container"></div>
                <button class="btn-secondary" onclick="menuSystem.showMenu('main')">⬅ Voltar</button>
            </div>
        `;
        container.appendChild(stagesMenu);

        // Menu Árvore de Melhorias / Talentos
        const talentsMenu = document.createElement('div');
        talentsMenu.id = 'menu-talents';
        talentsMenu.className = 'menu';
        talentsMenu.innerHTML = `
            <div class="menu-card large">
                <h2>✨ Árvore de Atributos & Aparência</h2>
                <div class="talent-points-header" id="talent-points-header"></div>
                
                <h3 style="margin: 15px 0 10px; font-size: 15px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">🎨 Escolha a Skin da Serpente</h3>
                <div class="skins-selector" id="skins-selector-container"></div>

                <h3 style="margin: 20px 0 10px; font-size: 15px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">⚡ Aprimoramentos de Status</h3>
                <div class="talents-grid" id="talents-grid-container"></div>

                <div style="margin-top: 20px;">
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">⬅ Voltar ao Menu</button>
                </div>
            </div>
        `;
        container.appendChild(talentsMenu);

        // Menu Dificuldade
        const difficultyMenu = document.createElement('div');
        difficultyMenu.id = 'menu-difficulty';
        difficultyMenu.className = 'menu';
        difficultyMenu.innerHTML = `
            <div class="menu-card large">
                <h2>⚔️ Selecione a Dificuldade</h2>
                <div class="difficulty-grid" style="display: flex; gap: 15px; margin-top: 20px; flex-direction: column;">
                    <button class="btn-secondary" style="padding: 15px; text-align: left; height: auto;" onclick="menuSystem.setDifficultyAndStart(0.8, 0.6)">
                        <h3 style="color: #34d399; margin: 0 0 5px 0;">🌱 Fácil</h3>
                        <p style="font-size: 13px; margin: 0; color: #94a3b8; font-weight: normal;">Jogo 20% mais lento, menos inimigos gerados.</p>
                    </button>
                    <button class="btn-primary" style="padding: 15px; text-align: left; height: auto;" onclick="menuSystem.setDifficultyAndStart(1.0, 1.0)">
                        <h3 style="margin: 0 0 5px 0;">⚔️ Normal</h3>
                        <p style="font-size: 13px; margin: 0; opacity: 0.9; font-weight: normal;">A experiência balanceada original.</p>
                    </button>
                    <button class="btn-secondary" style="padding: 15px; text-align: left; height: auto; border-color: rgba(239, 68, 68, 0.4);" onclick="menuSystem.setDifficultyAndStart(1.25, 1.5)">
                        <h3 style="color: #ef4444; margin: 0 0 5px 0;">🔥 Difícil</h3>
                        <p style="font-size: 13px; margin: 0; color: #94a3b8; font-weight: normal;">Jogo 25% mais rápido, monstros surgem implacavelmente.</p>
                    </button>
                </div>
                <div style="margin-top: 25px;">
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">⬅ Voltar</button>
                </div>
            </div>
        `;
        container.appendChild(difficultyMenu);

        // Menu Pausa
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'menu-pause';
        pauseMenu.className = 'menu';
        pauseMenu.innerHTML = `
            <div class="menu-card">
                <h2>⏸️ Jogo Pausado</h2>
                <p>Respire fundo e planeje sua estratégia.</p>
                <div class="menu-btn-group">
                    <button class="btn-primary" onclick="menuSystem.resumeGame()">▶ Continuar</button>
                    <button class="btn-secondary" onclick="menuSystem.restartStage()">🔄 Reiniciar Fase</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">🏠 Menu Principal</button>
                </div>
            </div>
        `;
        container.appendChild(pauseMenu);

        // Menu Como Jogar
        const aboutMenu = document.createElement('div');
        aboutMenu.id = 'menu-about';
        aboutMenu.className = 'menu';
        aboutMenu.innerHTML = `
            <div class="menu-card large">
                <h2>ℹ️ Como Jogar</h2>
                <div class="controls-guide">
                    <div class="guide-item"><strong>🎮 Movimento:</strong> Setas / WASD ou D-Pad Touch (Mobile)</div>
                    <div class="guide-item"><strong>🎯 [Q] Disparo:</strong> Atira projéteis mágicos na direção da cobra</div>
                    <div class="guide-item"><strong>💨 [Shift] Dash:</strong> Aceleração rápida com invulnerabilidade</div>
                    <div class="guide-item"><strong>🛡️ [E] Escudo:</strong> Barreira sagrada que absorve o próximo dano</div>
                    <div class="guide-item"><strong>🧲 [R] Magnetismo:</strong> Atrai todos os orbes e itens no grid</div>
                    <div class="guide-item"><strong>🦷 [T / Espaço] Devorar Inimigos:</strong> Abre mandíbulas vorazes e engole qualquer monstro que tocar na cabeça, curando +25 HP, aumentando o tamanho e dobrando o XP!</div>
                    <div class="guide-item"><strong>🛡️ Proteção Inicial:</strong> Toda fase inicia com 5 segundos de invencibilidade total para você se posicionar.</div>
                    <div class="guide-item"><strong>💾 Roguelite:</strong> Ao perder a fase, todo o XP ganho permanece salvo para melhorias permanentes!</div>
                </div>
                <button class="btn-secondary" onclick="menuSystem.showMenu('main')">⬅ Voltar</button>
            </div>
        `;
        container.appendChild(aboutMenu);

        // Menu Fase Concluída
        const stageClearedMenu = document.createElement('div');
        stageClearedMenu.id = 'menu-stageclear';
        stageClearedMenu.className = 'menu';
        stageClearedMenu.innerHTML = `
            <div class="menu-card">
                <h2 style="color: #2ecc71;">🎉 Fase Concluída!</h2>
                <p id="stageclear-summary"></p>
                <div class="menu-btn-group">
                    <button class="btn-primary" id="btn-next-stage" onclick="menuSystem.startNextStage()">▶ Próxima Fase</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('talents')">✨ Melhorar Atributos</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">🏠 Menu Principal</button>
                </div>
            </div>
        `;
        container.appendChild(stageClearedMenu);

        // Menu Game Over
        const gameOverMenu = document.createElement('div');
        gameOverMenu.id = 'menu-gameover';
        gameOverMenu.className = 'menu';
        gameOverMenu.innerHTML = `
            <div class="menu-card" style="background: rgba(11, 20, 34, 0.15); backdrop-filter: blur(8px) saturate(120%); -webkit-backdrop-filter: blur(8px) saturate(120%);">
                <h2 style="color: #e74c3c;">💀 Fim de Jogo</h2>
                <div id="gameover-stats"></div>
                <div class="menu-btn-group">
                    <button class="btn-primary" onclick="menuSystem.restartStage()">🔄 Tentar Novamente</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('talents')">✨ Melhorar Atributos</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">🏠 Menu Principal</button>
                </div>
            </div>
        `;
        container.appendChild(gameOverMenu);

        // Menu Vitória Final
        const victoryMenu = document.createElement('div');
        victoryMenu.id = 'menu-victory';
        victoryMenu.className = 'menu';
        victoryMenu.innerHTML = `
            <div class="menu-card large">
                <h2 style="color: #f1c40f;">👑 VITÓRIA SUPREMA!</h2>
                <p style="font-size: 16px; color: #ecf0f1;">Você derrotou o lendário Dragão Ancião e conquistou o reino do Grid!</p>
                <div id="victory-stats"></div>
                <div class="menu-btn-group">
                    <button class="btn-primary" onclick="menuSystem.promptDifficulty(1)">▶ Jogar Novamente</button>
                    <button class="btn-secondary" onclick="menuSystem.showMenu('main')">🏠 Menu Principal</button>
                </div>
            </div>
        `;
        container.appendChild(victoryMenu);
    }

    showMenu(menuName) {
        document.querySelectorAll('.menu').forEach(m => m.classList.remove('active'));

        if (!menuName) {
            this.currentMenu = null;
            return;
        }

        const menu = document.getElementById(`menu-${menuName}`);
        if (menu) {
            menu.classList.add('active');
            this.currentMenu = menuName;

            if (menuName === 'stages') this.renderStagesGrid();
            if (menuName === 'talents') this.renderTalentsGrid();

            // Tocar o tema místico do Templo nos menus principais
            if (typeof musicManager !== 'undefined' && ['main', 'stages', 'talents', 'settings', 'about'].includes(menuName)) {
                musicManager.playTheme('menu');
            }
        }
    }

    toggleMusic() {
        if (typeof musicManager === 'undefined') return;
        const enabled = musicManager.toggleMusic();
        
        const btnSetting = document.getElementById('btn-setting-music');
        if (btnSetting) {
            btnSetting.textContent = enabled ? 'LIGADA' : 'DESLIGADA';
            btnSetting.className = `btn-toggle-audio ${enabled ? 'active' : 'muted'}`;
        }
        const btnMenuToggle = document.getElementById('btn-menu-music-toggle');
        if (btnMenuToggle) {
            btnMenuToggle.textContent = enabled ? '🎵' : '🔇';
        }
        if (typeof hud !== 'undefined' && hud.showMessage) {
            hud.showMessage(enabled ? '🎵 Música: Ligada' : '🔇 Música: Mudo', 1200);
        }
    }

    toggleSFX() {
        if (typeof sfx === 'undefined') return;
        sfx.enabled = !sfx.enabled;
        const btnSetting = document.getElementById('btn-setting-sfx');
        if (btnSetting) {
            btnSetting.textContent = sfx.enabled ? 'LIGADO' : 'DESLIGADO';
            btnSetting.className = `btn-toggle-audio ${sfx.enabled ? 'active' : 'muted'}`;
        }
        if (sfx.enabled) sfx.playEat();
    }

    setMusicVolume(val) {
        const num = parseInt(val, 10);
        if (typeof musicManager !== 'undefined') {
            musicManager.setVolume(num / 100);
        }
        const label = document.getElementById('val-music-volume');
        if (label) label.textContent = `${num}%`;
    }

    setSFXVolume(val) {
        const num = parseInt(val, 10);
        if (typeof sfx !== 'undefined') {
            sfx.volume = num / 100;
            sfx.playShoot();
        }
        const label = document.getElementById('val-sfx-volume');
        if (label) label.textContent = `${num}%`;
    }

    renderStagesGrid() {
        const gridContainer = document.getElementById('stages-grid-container');
        if (!gridContainer) return;

        const unlocked = saveSystem.get('unlockedStage') || 1;

        const stages = [
            { num: 1, title: '🌲 1. A Floresta', desc: 'Slimes & Morcegos. Colete maçãs e sobreviva.' },
            { num: 2, title: '⛏️ 2. A Caverna', desc: 'Labirinto de pedras com Golems e Magos.' },
            { num: 3, title: '🐉 3. Trono do Boss', desc: 'Enfrente a Serpente Anciã Draconiana!' }
        ];

        gridContainer.innerHTML = stages.map(s => {
            const isUnlocked = s.num <= unlocked;
            return `
                <div class="stage-card ${isUnlocked ? 'unlocked' : 'locked'}" onclick="${isUnlocked ? `menuSystem.promptDifficulty(${s.num})` : ''}">
                    <h3>${s.title}</h3>
                    <p>${s.desc}</p>
                    <span class="stage-badge">${isUnlocked ? 'DESBLOQUEADA' : '🔒 BLOQUEADA'}</span>
                </div>
            `;
        }).join('');
    }

    renderTalentsGrid() {
        const header = document.getElementById('talent-points-header');
        const skinsContainer = document.getElementById('skins-selector-container');
        const gridContainer = document.getElementById('talents-grid-container');
        if (!header || !gridContainer) return;

        const data = saveSystem.data;
        const currentSkin = data.selectedSkin || 'emerald';

        header.innerHTML = `
            <div class="talent-status-bar">
                <span>⭐ Nível de Herói: <strong>${data.playerLevel}</strong></span>
                <span>💎 XP Total Salvo: <strong>${data.totalXP}</strong></span>
                <span><img src="assets/gold-coin.png" class="coin-icon" alt="Coins"> Pontos Disponíveis: <strong style="color: #f1c40f;">${data.skillPoints}</strong></span>
            </div>
        `;

        // Renderizar Skins
        if (skinsContainer) {
            const skins = [
                { id: 'emerald', name: 'Esmeralda Ancestral', color: '#2ecc71', desc: 'Dragão clássico' },
                { id: 'gold', name: 'Dragão Dourado', color: '#f1c40f', desc: 'Serpente mística' },
                { id: 'shadow', name: 'Serpente do Vazio', color: '#a29bfe', desc: 'Energia sombria' },
                { id: 'crimson', name: 'Inferno Carmesim', color: '#e74c3c', desc: 'Lança-chamas' }
            ];

            skinsContainer.innerHTML = skins.map(s => {
                const isSelected = s.id === currentSkin;
                return `
                    <div class="skin-option-card ${isSelected ? 'selected' : ''}" onclick="menuSystem.selectSkin('${s.id}')">
                        <div class="skin-circle" style="background: ${s.color}; box-shadow: 0 0 10px ${s.color}88;"></div>
                        <div class="skin-info">
                            <strong>${s.name}</strong>
                            <small>${s.desc}</small>
                        </div>
                        ${isSelected ? '<span class="skin-badge">EQUIPADA</span>' : '<button class="btn-skin-equip">Equipar</button>'}
                    </div>
                `;
            }).join('');
        }

        const talents = [
            { key: 'maxHp', name: '❤️ Vida Máxima', desc: '+1 Coração de vida base', max: 5 },
            { key: 'damage', name: '⚔️ Dano do Disparo', desc: '+1 Dano em cada tiro [Q]', max: 5 },
            { key: 'dashCooldown', name: '💨 Recarga do Dash', desc: '-12% Cooldown no Dash [W]', max: 4 },
            { key: 'shieldDuration', name: '🛡️ Duração do Escudo', desc: '+0.5s Duração do Escudo [E]', max: 4 },
            { key: 'magnetRadius', name: '🧲 Raio do Magnetismo', desc: '+45px Alcance para puxar itens', max: 4 },
            { key: 'speed', name: '⚡ Velocidade de Movimento', desc: '+10% Velocidade de locomoção', max: 3 }
        ];

        gridContainer.innerHTML = talents.map(t => {
            const lvl = data.upgrades[t.key] || 0;
            const isMax = lvl >= t.max;
            const canAfford = data.skillPoints >= 1 && !isMax;

            return `
                <div class="talent-card">
                    <h4>${t.name}</h4>
                    <p>${t.desc}</p>
                    <div class="talent-level-dots">
                        Nível: <strong>${lvl}/${t.max}</strong>
                    </div>
                    <button class="btn-upgrade ${canAfford ? 'active' : ''}" 
                        ${!canAfford ? 'disabled' : ''} 
                        onclick="menuSystem.buyTalent('${t.key}')">
                        ${isMax ? 'MÁXIMO' : 'Aprimorar (1 <img src="assets/gold-coin.png" class="coin-icon">)'}
                    </button>
                </div>
            `;
        }).join('');
    }

    selectSkin(skinId) {
        saveSystem.setSkin(skinId);
        if (typeof sfx !== 'undefined') sfx.playEat();
        this.renderTalentsGrid();
    }

    buyTalent(key) {
        const res = saveSystem.buyUpgrade(key);
        if (res.success) {
            if (typeof sfx !== 'undefined') sfx.playLevelUp();
            this.renderTalentsGrid();
        }
    }

    promptDifficulty(stageNum = 1) {
        this.pendingStageStart = stageNum;
        this.showMenu('difficulty');
    }

    setDifficultyAndStart(speedMult, spawnMult) {
        if (window.game) {
            window.game.difficulty = { speedMult, spawnMult };
        }
        this.startGame(this.pendingStageStart || 1);
    }

    startGame(stageNum = 1) {
        this.showMenu(null);
        if (window.game) {
            window.game.startStage(stageNum);
        }
    }

    startNextStage() {
        if (window.game) {
            const next = (window.game.currentStage || 1) + 1;
            this.startGame(next);
        }
    }

    restartStage() {
        if (window.game) {
            this.startGame(window.game.currentStage || 1);
        }
    }

    resumeGame() {
        if (window.game && window.game.isPaused) {
            window.game.pause(); // Isso vai chamar showMenu(null) e atualizar lastFrameTime
        } else {
            this.showMenu(null);
        }
    }

    showStageClear(stageNumber, snake) {
        const summary = document.getElementById('stageclear-summary');
        if (summary) {
            summary.innerHTML = `
                <p>Você completou a <strong>Fase ${stageNumber}</strong> com maestria!</p>
                <p>XP Conquistado na Fase: <strong>+${snake.runXP} XP</strong></p>
                <p>Inimigos Derrotados: <strong>${snake.enemiesDefeated}</strong></p>
            `;
        }
        this.showMenu('stageclear');
    }

    showGameOver(snake) {
        const stats = document.getElementById('gameover-stats');
        if (stats) {
            stats.innerHTML = `
                <div class="gameover-box">
                    <p>⭐ Nível da Partida: <strong>${snake.level}</strong></p>
                    <p>💎 XP Guardado no Save: <strong>+${snake.runXP} XP</strong></p>
                    <p>📦 Itens Coletados: <strong>${snake.itemsCollected}</strong></p>
                    <p>⚔️ Monstros Eliminados: <strong>${snake.enemiesDefeated}</strong></p>
                </div>
            `;
        }
        this.showMenu('gameover');
    }

    showVictory(snake) {
        const stats = document.getElementById('victory-stats');
        if (stats) {
            stats.innerHTML = `
                <div class="victory-box">
                    <p>⭐ Nível Final: <strong>${snake.level}</strong></p>
                    <p>💎 XP Total Conquistado: <strong>+${snake.runXP} XP</strong></p>
                    <p>⚔️ Inimigos e Chefão Eliminados: <strong>${snake.enemiesDefeated + 1}</strong></p>
                </div>
            `;
        }
        this.showMenu('victory');
    }

    resetProgress() {
        if (confirm("ATENÇÃO: Você tem certeza que deseja apagar todo o seu progresso? XP, fases e habilidades serão perdidos permanentemente.")) {
            if (typeof saveSystem !== 'undefined') {
                saveSystem.resetData();
            } else {
                localStorage.clear();
                location.reload();
            }
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('game-container') || document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen().catch(() => {});
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}

const menuSystem = new MenuSystem();
