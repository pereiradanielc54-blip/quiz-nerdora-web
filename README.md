# Quiz Nerdora Web

PWA oficial do Quiz Nerdora.

## Publicação oficial

- **GitHub:** `pereiradanielc54-blip/quiz-nerdora-web`
- **Branch de produção:** `main`
- **Vercel:** conectado diretamente a este repositório.
- **URL de produção:** `https://quiz-nerdora-web.vercel.app`

## Fluxo de atualização

1. Toda alteração da versão Web/PWA é feita neste repositório.
2. A versão pública é registrada em `web-pwa-src/version.json`.
3. Um commit em `main` dispara automaticamente um novo deployment de produção no Vercel.
4. O build gera o site final e injeta o SHA do commit em `version.json` e `sw.js`.
5. O aplicativo instalado consulta a versão ao abrir, voltar ao app, recuperar a internet e a cada 5 minutos.
6. Quando um novo build é encontrado, o Service Worker assume a nova versão e o PWA recarrega sem precisar ser desinstalado.

## Regra para próximas versões

As próximas versões Web devem seguir `web-pwa-X.Y.Z`. Mudanças devem ser publicadas em um único commit sempre que possível, evitando deployments intermediários desnecessários.

## Banco e assets

O build reconstrói o pacote de assets a partir de `web-transfer/tar.b64.part.*`, extrai o banco de perguntas, arte da Home, ícone e músicas e valida o catálogo antes da publicação.
