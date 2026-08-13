/**
 * Menus
 * Telas de menu (inicial, game over, pausa, etc)
 */

class MenuSystem {
    constructor() {
        this.currentMenu = 'main';
        this.createMenus();
    }

    /**
     * Cria estrutura HTML dos menus
     */
    createMenus() {
        const container = document.getElementById('game-container');

        // Menu Principal
        const mainMenu = document.createElement('div');
        mainMenu.id = 'menu-main';
        mainMenu.className = 'menu active';
        mainMenu.innerHTML = `
            <h1>🐍 Cobrinha RPG</h1>
            <p>Conquer the grid, level up, master skills!</p>
            <button onclick="menuSystem.startGame()">Iniciar Jogo</button>
            <button onclick="menuSystem.showMenu('about')">Sobre</button>
        `;
        container.appendChild(mainMenu);

        // Menu Game Over
        const gameOverMenu = document.createElement('div');
        gameOverMenu.id = 'menu-gameover';
        gameOverMenu.className = 'menu';
        gameOverMenu.innerHTML = `
            <h1>💀 Game Over</h1>
            <p id="gameover-stats"></p>
            <button onclick="menuSystem.startGame()">Tentar Novamente</button>
            <button onclick="menuSystem.showMenu('main')">Menu Principal</button>
        `;
        container.appendChild(gameOverMenu);

        // Menu Pausa
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'menu-pause';
        pauseMenu.className = 'menu';
        pauseMenu.innerHTML = `
            <h1>⏸️ Pausa</h1>
            <p>Jogo Pausado</p>
            <button onclick="menuSystem.resumeGame()">Continuar</button>
            <button onclick="menuSystem.showMenu('main')">Menu Principal</button>
        `;
        container.appendChild(pauseMenu);

        // Menu Sobre
        const aboutMenu = document.createElement('div');
        aboutMenu.id = 'menu-about';
        aboutMenu.className = 'menu';
        aboutMenu.innerHTML = `
            <h1>ℹ️ Sobre</h1>
            <p>Um clássico jogo de cobrinha com elementos de RPG.<br>
            Suba de nível, desbloqueie habilidades e vença o chefão!</p>
            <button onclick="menuSystem.showMenu('main')">Voltar</button>
        `;
        container.appendChild(aboutMenu);

        // Menu Vitória
        const victoryMenu = document.createElement('div');
        victoryMenu.id = 'menu-victory';
        victoryMenu.className = 'menu';
        victoryMenu.innerHTML = `
            <h1>🎉 Você Venceu!</h1>
            <p id="victory-stats"></p>
            <button onclick="menuSystem.startGame()">Jogar Novamente</button>
            <button onclick="menuSystem.showMenu('main')">Menu Principal</button>
        `;
        container.appendChild(victoryMenu);
    }

    /**
     * Mostra menu
     */
    showMenu(menuName) {
        // Ocultar todos
        document.querySelectorAll('.menu').forEach(m => m.classList.remove('active'));

        // Mostrar selecionado
        const menu = document.getElementById(`menu-${menuName}`);
        if (menu) {
            menu.classList.add('active');
            this.currentMenu = menuName;
        }
    }

    /**
     * Inicia o jogo
     */
    startGame() {
        this.showMenu(null); // Ocultar menus
        
        // Criar novo jogo
        if (window.game) {
            window.game.cleanup?.();
        }

        window.game = new Game();
        window.game.start();
    }

    /**
     * Retoma o jogo
     */
    resumeGame() {
        this.showMenu(null);
        if (window.game) {
            window.game.isPaused = false;
        }
    }

    /**
     * Mostra tela de game over
     */
    showGameOver(snake) {
        const stats = document.getElementById('gameover-stats');
        stats.innerHTML = `
            <p>Nível Alcançado: ${snake.level}</p>
            <p>Pontos: ${snake.level * 100}</p>
        `;
        this.showMenu('gameover');
    }

    /**
     * Mostra tela de vitória
     */
    showVictory(snake) {
        const stats = document.getElementById('victory-stats');
        stats.innerHTML = `
            <p>Nível Final: ${snake.level}</p>
            <p>Pontos Totais: ${snake.level * 500}</p>
        `;
        this.showMenu('victory');
    }
}

// Criar instância global
const menuSystem = new MenuSystem();
