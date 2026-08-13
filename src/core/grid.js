/**
 * Grid System
 * Gerencia coordenadas em grid e conversão pixel/grid
 */

class GridSystem {
    constructor(width, height, cellSize = 20) {
        this.width = width;           // 800
        this.height = height;         // 600
        this.cellSize = cellSize;     // pixels por célula
        this.cols = Math.floor(width / cellSize);
        this.rows = Math.floor(height / cellSize);
    }

    /**
     * Converte posição em pixels para coordenadas de grid
     */
    pixelsToGrid(x, y) {
        return {
            gridX: Math.floor(x / this.cellSize),
            gridY: Math.floor(y / this.cellSize)
        };
    }

    /**
     * Converte coordenadas de grid para pixels
     */
    gridToPixels(gridX, gridY) {
        return {
            pixelX: gridX * this.cellSize,
            pixelY: gridY * this.cellSize
        };
    }

    /**
     * Verifica se posição está dentro dos limites do grid
     */
    isValidPosition(gridX, gridY) {
        return gridX >= 0 && gridX < this.cols && gridY >= 0 && gridY < this.rows;
    }

    /**
     * Gera posição aleatória válida no grid
     */
    randomPosition() {
        return {
            gridX: Math.floor(Math.random() * this.cols),
            gridY: Math.floor(Math.random() * this.rows)
        };
    }

    /**
     * Calcula distância Manhattan entre dois pontos
     */
    distance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}

// Criar instância global
const grid = new GridSystem(800, 600);
