# 🐍 Cobrinha RPG - Web

Um clássico jogo de cobrinha com elementos de RPG, totalmente rodando no navegador!

## 🎮 Jogar Agora

**GitHub Pages:** [clique aqui para jogar](https://gustavoborgesbr.github.io/JogoDaCobrinhaV2/)

## 🕹️ Controles

| Ação | Tecla |
|------|-------|
| Mover para CIMA | ⬆️ ou **W** |
| Mover para BAIXO | ⬇️ ou **S** |
| Mover para ESQUERDA | ⬅️ ou **A** |
| Mover para DIREITA | ➡️ ou **D** |
| Pausar | **P** |
| Ativar Skill | **Espaço** |

## 📋 Recursos

- ✅ Movimento fluido em grid
- ✅ Sistema de XP e leveling
- ✅ Habilidades ativas com cooldown
- ✅ Inimigos com diferentes tipos
- ✅ Sistema de itens com raridade
- ✅ Múltiplas fases temáticas
- ✅ Chefão final
- ✅ Save automático em localStorage
- ✅ Sprites animados

## 🏗️ Arquitetura

```
src/
├── core/           # Sistema de grid, input, save, sprites
├── entities/       # Cobra, inimigos, itens
├── systems/        # XP, skills, combate
├── stages/         # Fases do jogo
└── ui/             # HUD, menus
```

## 🚀 Como Executar Localmente

1. Clone o repositório
```bash
git clone https://github.com/gustavoborgesbr/JogoDaCobrinhaV2
cd JogoDaCobrinhaV2
```

2. Use um servidor HTTP local (Python)
```bash
python -m http.server 8000
```

3. Abra no navegador
```
http://localhost:8000
```

## 📚 Documentação

- [Escopo Técnico](Scopo.md) - Visão geral do projeto
- [Sistema de Sprites](SPRITES.md) - Como usar os sprites

## 🛠️ Stack Tecnológico

- **HTML5 Canvas** - Renderização
- **JavaScript ES6+** - Lógica do jogo
- **localStorage** - Persistência de dados
- **GitHub Pages** - Hospedagem

## 📝 Roadmap

- [x] Estrutura base
- [x] Sistema de grid
- [x] Cobra jogável com sprites
- [ ] Inimigos e colisões
- [ ] Sistema de XP completo
- [ ] Habilidades funcionais
- [ ] Fases temáticas
- [ ] Chefão
- [ ] Polimento visual/áudio

## 🎨 Sprites

Sprites animados para a cobra em 4 direções com múltiplos frames de animação. 
Veja [SPRITES.md](SPRITES.md) para mais detalhes.

## 📞 Suporte

Encontrou um bug? Abra uma issue no GitHub!

---

**Feito com ❤️ usando Canvas puro**
