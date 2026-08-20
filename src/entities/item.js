/**
 * Item
 * Itens colecionáveis no grid:
 * - 'xp' (comum, raro, épico)
 * - 'heal' (cura 1-2 HP)
 * - 'fury' (aumenta dano do disparo temporariamente)
 * - 'shield' (concede escudo protetor)
 * - 'magnet' (atração temporária)
 */

class Item {
    constructor(gridX, gridY, type = 'xp', rarity = 'common') {
        this.gridX = gridX;
        this.gridY = gridY;
        this.type = type;
        this.rarity = rarity;

        // Posição contínua para animações de magnetismo
        const pos = grid.gridToPixels(gridX, gridY);
        this.px = pos.pixelX + grid.cellSize / 2;
        this.py = pos.pixelY + grid.cellSize / 2;

        this.collected = false;
        this.lifespan = 40000;
        this.createdAt = Date.now();

        this.setupByType();
    }

    setupByType() {
        switch (this.type) {
            case 'heal':
                this.value = 1;
                this.color = '#e74c3c';
                this.icon = '❤️';
                this.rarity = 'rare';
                break;
            case 'fury':
                this.value = 10000; // 10s de fúria
                this.color = '#e67e22';
                this.icon = '🔥';
                this.rarity = 'rare';
                break;
            case 'shield':
                this.value = 4000;
                this.color = '#f1c40f';
                this.icon = '🛡️';
                this.rarity = 'rare';
                break;
            case 'magnet':
                this.value = 5000;
                this.color = '#9b59b6';
                this.icon = '🧲';
                this.rarity = 'epic';
                break;
            default: // 'xp'
                this.type = 'xp';
                this.value = this.getRarityXP();
                this.color = this.getRarityColor();
                this.icon = '💎';
        }
    }

    getRarityXP() {
        switch (this.rarity) {
            case 'rare': return 120;
            case 'epic': return 350;
            default: return 40;
        }
    }

    getRarityColor() {
        switch (this.rarity) {
            case 'rare': return '#3498db';
            case 'epic': return '#f39c12';
            default: return '#2ecc71';
        }
    }

    isExpired() {
        return Date.now() - this.createdAt > this.lifespan;
    }

    update(snake) {
        if (this.collected) return;

        // Se magnetismo estiver ativo na cobra, ou upgrade de raio
        if (snake) {
            const head = snake.getHeadPosition();
            const headPixels = grid.gridToPixels(head.gridX, head.gridY);
            const targetX = headPixels.pixelX + grid.cellSize / 2;
            const targetY = headPixels.pixelY + grid.cellSize / 2;

            const dx = targetX - this.px;
            const dy = targetY - this.py;
            const dist = Math.hypot(dx, dy);

            const upgrades = saveSystem.getUpgrades();
            const baseMagnetRadius = snake.isMagnetActive ? 320 : (upgrades.magnetRadius ? upgrades.magnetRadius * 45 : 0);

            if (dist < baseMagnetRadius && dist > 1) {
                const speed = snake.isMagnetActive ? 280 : 180;
                const step = speed * 0.016;
                this.px += (dx / dist) * step;
                this.py += (dy / dist) * step;

                // Atualizar coordenada de grid aproximada
                const currentGrid = grid.pixelsToGrid(this.px, this.py);
                this.gridX = currentGrid.gridX;
                this.gridY = currentGrid.gridY;
            }
        }
    }

    collect() {
        this.collected = true;
        if (typeof sfx !== 'undefined') sfx.playItemCollect();
        if (typeof particleSystem !== 'undefined') {
            particleSystem.createExplosion(this.px, this.py, this.color, 12);
        }
        return this.value;
    }

    render(ctx) {
        if (this.collected) return;

        const now = Date.now();
        const floatOffset = Math.sin((now - this.createdAt) / 200) * 3;
        const radius = grid.cellSize * 0.38;

        ctx.save();

        if (this.type === 'heal' && typeof spriteManager !== 'undefined' && spriteManager.appleImageLoaded) {
            // Draw apple image
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 3;
            ctx.imageSmoothingEnabled = false;
            
            const size = grid.cellSize * 1.1; // Slightly larger for better visibility
            ctx.drawImage(
                spriteManager.appleImage,
                this.px - size / 2,
                this.py + floatOffset - size / 2,
                size,
                size
            );
        } else {
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = this.rarity !== 'common' ? 10 : 4;

            ctx.beginPath();
            ctx.arc(this.px, this.py + floatOffset, radius, 0, Math.PI * 2);
            ctx.fill();

            // Anel decorativo
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(this.px, this.py + floatOffset, radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    getPosition() {
        return { gridX: this.gridX, gridY: this.gridY };
    }
}

class ItemPool {
    constructor() {
        this.items = [];
    }

    addItem(gridX, gridY, type = 'xp', rarity = 'common') {
        const item = new Item(gridX, gridY, type, rarity);
        this.items.push(item);
        return item;
    }

    spawnRandomItem(gridX, gridY) {
        const rand = Math.random();
        if (rand < 0.07) {
            return this.addItem(gridX, gridY, 'heal', 'rare');
        } else if (rand < 0.14) {
            return this.addItem(gridX, gridY, 'shield', 'rare');
        } else if (rand < 0.20) {
            return this.addItem(gridX, gridY, 'fury', 'rare');
        } else if (rand < 0.25) {
            return this.addItem(gridX, gridY, 'magnet', 'epic');
        } else if (rand < 0.40) {
            return this.addItem(gridX, gridY, 'xp', 'rare');
        } else {
            return this.addItem(gridX, gridY, 'xp', 'common');
        }
    }

    updateAll(snake) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update(snake);
            if (item.collected || item.isExpired()) {
                this.items.splice(i, 1);
            }
        }
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
