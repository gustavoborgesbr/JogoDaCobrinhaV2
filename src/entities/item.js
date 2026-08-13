/**
 * Item
 * Itens que a cobra pode coletar (XP, poder temporário, etc)
 */

class Item {
    constructor(gridX, gridY, type = 'xp', rarity = 'common') {
        this.gridX = gridX;
        this.gridY = gridY;
        this.type = type;     // 'xp', 'heal', 'speed', 'invincible'
        this.rarity = rarity; // 'common', 'rare', 'epic'
        
        this.collected = false;
        this.lifespan = 30000; // ms até desaparecer
        this.createdAt = Date.now();

        this.setupByType();
    }

    setupByType() {
        switch (this.type) {
            case 'heal':
                this.value = 1;
                this.color = '#3498db';
                this.rarity = 'rare';
                break;
            case 'speed':
                this.value = 5000; // 5 segundos
                this.color = '#f39c12';
                this.rarity = 'rare';
                break;
            case 'invincible':
                this.value = 3000; // 3 segundos
                this.color = '#e74c3c';
                this.rarity = 'epic';
                break;
            default: // 'xp'
                this.value = this.getRarityXP();
                this.color = this.getRarityColor();
        }
    }

    getRarityXP() {
        switch (this.rarity) {
            case 'rare':
                return 150;
            case 'epic':
                return 500;
            default:
                return 50;
        }
    }

    getRarityColor() {
        switch (this.rarity) {
            case 'rare':
                return '#3498db';
            case 'epic':
                return '#f39c12';
            default:
                return '#27ae60';
        }
    }

    /**
     * Verifica se item expirou
     */
    isExpired() {
        return Date.now() - this.createdAt > this.lifespan;
    }

    /**
     * Coleta o item
     */
    collect() {
        this.collected = true;
        console.log(`📦 Item coletado: ${this.type} (${this.rarity})`);
        return this.value;
    }

    /**
     * Desenha o item
     */
    render(ctx) {
        if (this.collected) return;

        const pos = grid.gridToPixels(this.gridX, this.gridY);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            pos.pixelX + grid.cellSize / 2,
            pos.pixelY + grid.cellSize / 2,
            grid.cellSize / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Brilho para itens raros
        if (this.rarity !== 'common') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
                pos.pixelX + grid.cellSize / 2,
                pos.pixelY + grid.cellSize / 2,
                grid.cellSize / 2,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }

    getPosition() {
        return { gridX: this.gridX, gridY: this.gridY };
    }
}

/**
 * Pool de itens
 */
class ItemPool {
    constructor() {
        this.items = [];
    }

    addItem(gridX, gridY, type = 'xp', rarity = 'common') {
        const item = new Item(gridX, gridY, type, rarity);
        this.items.push(item);
        return item;
    }

    /**
     * Gera item aleatório com chance de raridade
     */
    spawnRandomItem(gridX, gridY) {
        let rarity = 'common';
        const rand = Math.random();

        if (rand < 0.05) {
            rarity = 'epic';
        } else if (rand < 0.2) {
            rarity = 'rare';
        }

        return this.addItem(gridX, gridY, 'xp', rarity);
    }

    updateAll() {
        // Remover itens expirados ou coletados
        this.items = this.items.filter(item => !item.collected && !item.isExpired());
    }

    renderAll(ctx) {
        this.items.forEach(item => item.render(ctx));
    }

    getAll() {
        return this.items;
    }

    clear() {
        this.items = [];
    }
}
