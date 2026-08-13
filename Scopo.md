# Escopo Técnico — Cobrinha RPG (Web)

## 1. Visão geral
Jogo de cobrinha em grid, com camadas de RPG: XP, níveis, habilidades, itens, fases temáticas e um chefão. Rodando 100% no navegador, sem backend — progresso salvo em `localStorage`.

---

## 2. Stack técnica

| Camada | Tecnologia |
|---|---|
| Renderização | HTML5 Canvas 2D API |
| Lógica de jogo | JavaScript puro (ES6+, sem framework) |
| Persistência | `localStorage` (save local no navegador) |
| Áudio | Web Audio API (efeitos simples) ou `<audio>` tags |
| Build | Nenhum build necessário no início — pode evoluir pra Vite se o projeto crescer |

**Por que Canvas puro:** controle total sobre o loop de jogo, sem overhead de framework, mais fácil de entender e debugar linha por linha — importante já que o grid e a física de colisão precisam ser bem precisos.

---

## 3. Arquitetura de arquivos (sugestão inicial)

```
cobrinha-rpg/
├── index.html
├── style.css
├── src/
│   ├── main.js              # loop principal do jogo (game loop)
│   ├── core/
│   │   ├── grid.js          # sistema de grid e coordenadas
│   │   ├── input.js         # captura de teclado
│   │   └── save.js          # leitura/escrita no localStorage
│   ├── entities/
│   │   ├── snake.js         # lógica da cobra (movimento, colisão, skills)
│   │   ├── enemy.js         # inimigos e IA de movimento
│   │   └── item.js          # itens, drops, raridade
│   ├── systems/
│   │   ├── xp.js            # cálculo de XP e level up
│   │   ├── skills.js        # árvore de habilidades e cooldowns
│   │   └── combat.js        # resolução de colisão cobra x inimigo
│   ├── stages/
│   │   ├── stage1.js
│   │   ├── stage2.js
│   │   └── boss.js
│   └── ui/
│       ├── hud.js           # barra de XP, vida, nível
│       └── menus.js         # tela inicial, game over, vila
└── assets/
    ├── sprites/
    └── sfx/
```

---

## 4. Game loop (estrutura técnica)

```
requestAnimationFrame loop:
  1. Processar input (fila de direção)
  2. Atualizar lógica (tick baseado em grid, não em pixel)
  3. Resolver colisões (parede, próprio corpo, inimigo, item)
  4. Atualizar sistemas (XP, cooldown de skills, IA de inimigos)
  5. Renderizar frame (Canvas.clearRect + desenhar tudo)
  6. Atualizar HUD (DOM ou desenhado no próprio canvas)
```

**Decisão importante:** movimento em **grid discreto** (como o snake clássico) em vez de posição livre em pixels. Isso simplifica muito colisão, pathing de inimigos e fica fiel à mecânica original. A velocidade vira "tempo entre ticks" (ex: 150ms por tick, diminuindo com upgrades de velocidade).

---

## 5. Sistemas de RPG (para versão média)

### XP e Nível
- Cada fonte de XP (item, inimigo derrotado) definida em `xp.js`
- Fórmula de nível: ex. `xpNecessario = base * nivel^1.5`
- Level up libera ponto de habilidade ou aumenta atributo automaticamente (definir qual abordagem no design)

### Habilidades
- 2 a 4 habilidades ativas (dash, escudo, ataque em área, atravessar parede 1x)
- Sistema de cooldown simples (timestamp + delay)
- Tecla dedicada (espaço ou número) pra ativar

### Itens
- Tabela de raridade: comum / raro / épico
- Drop rate por raridade
- Efeitos: XP bônus, velocidade temporária, encolher, invencibilidade curta

### Combate
- Cobra não morre na primeira colisão com inimigo — tem "vida" (ex: 3 corações)
- Inimigo pode ser derrotado (vira XP) ou drenar vida se colidir sem estratégia

### Fases
- 3-4 fases temáticas com obstáculos e paleta diferentes
- 1 chefão ao final — padrão de movimento único, precisa de estratégia (ex: esquivar + usar skill no momento certo)

### Save (localStorage)
- Salvar: nível máximo alcançado, fase liberada, recorde de pontuação
- Estrutura sugerida:
```js
{
  "highestLevel": 5,
  "unlockedStage": 3,
  "highScore": 1200,
  "unlockedSkills": ["dash", "shield"]
}
```

---

## 6. Roadmap de desenvolvimento sugerido

1. **Fundação**: grid, movimento, colisão básica, game loop rodando
2. **XP e nível**: coletar item → ganhar XP → subir de nível (sem skill ainda)
3. **Primeira habilidade**: dash com cooldown
4. **Inimigos simples**: 1 tipo, movimento reto ou perseguição básica
5. **Sistema de vida**: cobra não morre na primeira colisão
6. **Itens e raridade**: drops variados
7. **Fase 2 e 3**: reaproveitar sistema, trocar cenário/obstáculos
8. **Chefão**: padrão de ataque único
9. **Save/load**: localStorage
10. **Polimento**: HUD, sons, tela de menu/game over

---

## 7. Pontos em aberto pra decidir antes de codar
- [ ] Estilo visual: pixel art, geométrico/flat, ou minimalista?
- [ ] Quantas habilidades ativas na v1: 1, 2 ou mais?
- [ ] Level up é automático (atributo sobe sozinho) ou o jogador escolhe (árvore de skill)?
- [ ] Inimigos têm IA de perseguição real ou padrão fixo (mais simples)?
- [ ] Terá menu de "vila" entre fases ou é direto fase 1 → 2 → 3 → boss?