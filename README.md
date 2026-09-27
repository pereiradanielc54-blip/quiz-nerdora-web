# Quiz Nerdora Web

PWA oficial do Quiz Nerdora, publicado automaticamente pelo Vercel.

## Produção

- GitHub: `pereiradanielc54-blip/quiz-nerdora-web`
- Branch: `main`
- Vercel: `https://quiz-nerdora-web.vercel.app`
- Versão atual: **0.17.5**

## Base recuperada

A v0.15.0 volta a usar a lógica completa consolidada antes da migração simplificada do PWA:

- quatro níveis: Novato de Academia, Senpai Otaku, Elite Shonen e Lenda do Multiverso;
- 10 / 15 / 20 / 25 perguntas;
- 3 vidas, recuperação de vida entre níveis, XP e combo;
- timers de Elite e Lenda;
- Boss Questions e Aposta Otaku final;
- seleção anti-repetição por `fact_id` e cooldown local;
- Desafio Diário;
- Duelo Otaku por seed/código;
- Ranking local;
- **40 conquistas permanentes + 20 temporárias**;
- estatísticas de run, recordes e progressão local;
- Portal Nerdora no menu e Primeiro Desafio durante a run.

O áudio agora pausa quando o PWA perde visibilidade ou vai para segundo plano e retoma a trilha adequada ao retornar.

## Atualizações

Todo commit em `main` gera um deployment de produção no Vercel. O `version.json` e o Service Worker são atualizados por build, permitindo atualizar o aplicativo instalado sem reinstalação.
\n\n## Integração Nerdora\n\nA v0.17.5 adiciona a ponte oficial com o Nerdora: quando aberto em Mundo Nerd → Nerdora Games, o Quiz recebe nome, @usuário e foto do perfil e sincroniza as conquistas permanentes desbloqueadas com o perfil principal.\n