#!/usr/bin/env bash
set -euo pipefail

rm -rf site extracted
mkdir -p site extracted
cp web-pwa-src/* site/

TAR="QuizNerdora-Android-v0.13.0.tar.gz"
if compgen -G "web-transfer/tar.b64.part.*" > /dev/null; then
  echo "Reconstruindo pacote do Quiz Nerdora..."
  cat web-transfer/tar.b64.part.* | base64 -d > "$TAR"
fi
test -s "$TAR"
tar -xzf "$TAR" -C extracted
ROOT=$(find extracted -maxdepth 2 -type f -name settings.gradle.kts -printf '%h\n' | head -n 1)
test -n "$ROOT"

cp "$ROOT/app/src/main/assets/quiz_questions.json" site/quiz_questions.json
cp "$ROOT/app/src/main/res/drawable-nodpi/quiz_nerdora_home_art.png" site/home_art.png
cp "$ROOT/app/src/main/res/drawable-nodpi/quiz_nerdora_cover.png" site/icon.png
cp "$ROOT/app/src/main/assets/music/portal_nerdora.mp3" site/portal_nerdora.mp3
cp "$ROOT/app/src/main/assets/music/primeiro_desafio.mp3" site/primeiro_desafio.mp3

# A fonte oficial da interface e lógica Web é web-pwa-src/.
# Não sobrescrever site/index.html com templates antigos.
BUILD_ID="${VERCEL_GIT_COMMIT_SHA:-local}"
sed -i "s/__BUILD__/${BUILD_ID}/g" site/sw.js site/version.json

python3 - <<'PY'
import json
d=json.load(open('site/quiz_questions.json',encoding='utf-8'))
qs=[q for l in d['levels'] for q in l['questions']]
assert len(qs)==900, len(qs)
assert len({q['fact_id'] for q in qs})==900
print('Quiz Nerdora Web: catálogo OK — 900 perguntas únicas')
PY

node --check site/app.js
python3 -m json.tool site/manifest.webmanifest >/dev/null
python3 -m json.tool site/achievements.json >/dev/null
grep -q "40 PERMANENTES" site/app.js
grep -q "function startDaily()" site/app.js
grep -q "function createDuel()" site/app.js
grep -q "function betScreen()" site/app.js
grep -q "visibilitychange" site/app.js
grep -q "pagehide" site/app.js
