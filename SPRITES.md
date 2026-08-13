# 🐍 Usando Sprites no Jogo

## ✅ O que foi implementado

### 1. **Sprite Manager** (`src/core/sprite-manager.js`)
- Carrega a sprite sheet automaticamente
- Mapeia coordenadas dos sprites
- Fornece métodos para renderizar sprites por ID

### 2. **Animação da Cobra**
- Sistema de frames de animação
- Diferentes sprites para cada direção
- Fallback para cores sólidas se sprites não carregarem

### 3. **Integração com Renderização**
- `snake.render()` agora usa sprites
- Suporte a diferentes tipos de segmentos (reto, curva, cauda)

---

## 🎮 Como Jogar

1. **Abra `index.html` no navegador**
2. **Clique em "Iniciar Jogo"**
3. **Controle a cobra:**
   - ⬆️ **Setas** ou **W/A/S/D** para mover
   - **P** para pausar
   - **Espaço** para ativar skill (quando implementado)

---

## 🔧 Se os Sprites Não Aparecerem

### Opção 1: Verificar coordenadas
O arquivo `sprite-manager.js` tem um mapa de sprites:
```javascript
this.spriteMap = {
    'up_0': { x: 311, y: 97 },
    // ...
}
```

Se os sprites aparentarem fora de posição, ajuste os valores `x` e `y`.

### Opção 2: Debug Visual
Abra o DevTools (F12) e execute:
```javascript
// Verificar se sprite sheet carregou
console.log(spriteManager.isLoaded);

// Ver posições dos sprites
console.log(spriteManager.spriteMap);
```

### Opção 3: Usar Sprite Alternativa
Se tiver problemas com o nome do arquivo (`ChatGPT Image...`), renomei para algo simples como `cobra-sprites.png` e atualize em `sprite-manager.js`:
```javascript
this.spriteSheet.src = 'assets/sprites/cobra-sprites.png';
```

---

## 📝 Estrutura da Sprite Sheet

A imagem contém:

| Seção | Descrição | Frames |
|-------|-----------|--------|
| **PARA CIMA** ⬆️ | Cobra animada subindo | 5 frames |
| **PARA BAIXO** ⬇️ | Cobra animada descendo | 5 frames |
| **PARA ESQUERDA** ⬅️ | Cobra animada indo esquerda | 4 frames |
| **PARA DIREITA** ➡️ | Cobra animada indo direita | 4 frames |
| **CABEÇA** 🐱 | 4 direções estáticas | 4 imagens |
| **CORPO** | Reto, curvas, cauda | 4 tipos |

---

## 🚀 Próximos Passos

- [ ] Ajustar coordenadas dos sprites se necessário
- [ ] Adicionar inimigos com sprites
- [ ] Adicionar itens com sprites
- [ ] Implementar efeitos visuais
- [ ] Adicionar sons/música

---

## 💡 Dicas

- A cobra começa no **centro do grid**
- Cada célula tem **20x20 pixels**
- O canvas é **800x600**
- Grid é **40 colunas × 30 linhas**

Bom jogo! 🎮
