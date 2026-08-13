/**
 * Save System
 * Gerencia persistência em localStorage
 */

class SaveSystem {
    constructor() {
        this.storageKey = 'cobrinha_rpg_save';
        this.defaultSave = {
            highestLevel: 1,
            unlockedStage: 1,
            highScore: 0,
            unlockedSkills: [],
            playTime: 0
        };

        this.load();
    }

    /**
     * Carrega dados do localStorage
     */
    load() {
        const saved = localStorage.getItem(this.storageKey);
        this.data = saved ? JSON.parse(saved) : { ...this.defaultSave };
        console.log('💾 Save carregado:', this.data);
        return this.data;
    }

    /**
     * Salva dados no localStorage
     */
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        console.log('✅ Save gravado!');
    }

    /**
     * Atualiza valor específico
     */
    update(key, value) {
        this.data[key] = value;
        this.save();
    }

    /**
     * Retorna valor do save
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Limpa todos os dados
     */
    clear() {
        localStorage.removeItem(this.storageKey);
        this.data = { ...this.defaultSave };
        console.log('🗑️ Save limpo!');
    }

    /**
     * Exporta dados como JSON (para backup)
     */
    export() {
        return JSON.stringify(this.data, null, 2);
    }

    /**
     * Importa dados de JSON
     */
    import(jsonString) {
        try {
            this.data = JSON.parse(jsonString);
            this.save();
            console.log('📥 Save importado!');
            return true;
        } catch (e) {
            console.error('❌ Erro ao importar save:', e);
            return false;
        }
    }
}

// Criar instância global
const saveSystem = new SaveSystem();
