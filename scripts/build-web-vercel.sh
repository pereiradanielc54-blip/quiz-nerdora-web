#!/usr/bin/env bash
set -euo pipefail

rm -rf site extracted
mkdir -p site extracted
cp -r web-pwa-src/* site/

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

# Aplica a revisão semântica das alternativas sem alterar respostas corretas.
python3 - <<'PY'
import json
bank_path='site/quiz_questions.json'
ov_path='web-pwa-src/question_overrides.json'
d=json.load(open(bank_path,encoding='utf-8'))
ov=json.load(open(ov_path,encoding='utf-8'))
by={x['id']:x for x in ov['questions']}
seen=set()
for level in d['levels']:
    for q in level['questions']:
        q.setdefault('question_version',1)
        x=by.get(q['id'])
        if not x: continue
        old_correct=next(o['text'] for o in q['options'] if o['id']==q['correct_option'])
        q['options']=x['new_options']
        q['question_version']=2
        new_correct=next(o['text'] for o in q['options'] if o['id']==q['correct_option'])
        assert old_correct==new_correct, q['id']
        seen.add(q['id'])
assert seen==set(by), (len(seen),len(by))
d['total_questions']=sum(len(l['questions']) for l in d['levels'])
d['version']='0.5.0'
d.setdefault('design_notes',{})['semantic_option_revision']='Revisão v0.17: alternativas coerentes + versionamento por pergunta + auditoria automática.'
json.dump(d,open(bank_path,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('Question overrides applied:',len(seen))

PY
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

python3 scripts/audit_questions.py site/quiz_questions.json
python3 scripts/semantic_audit.py site/quiz_questions.json site/question_semantic_audit.json
python3 scripts/similar_questions.py site/quiz_questions.json site/similar_questions_report.json
test -s site/question_semantic_audit.json
test -s site/similar_questions_report.json
node --check site/app.js
python3 -m json.tool site/manifest.webmanifest >/dev/null
python3 -m json.tool site/achievements.json >/dev/null
python3 -m json.tool site/store_catalog.json >/dev/null
python3 -m json.tool site/quality_config.json >/dev/null
python3 -m json.tool site/question_semantic_audit.json >/dev/null
python3 -m json.tool site/similar_questions_report.json >/dev/null
grep -q "function achievements(" site/app.js
grep -q "function startDaily()" site/app.js
grep -q "function createDuel()" site/app.js
grep -q "function betScreen()" site/app.js
grep -q "visibilitychange" site/app.js
grep -q "pagehide" site/app.js
grep -q "function shop(" site/app.js
grep -q "NerdoraQuizBridge" site/app.js

grep -q "function qualityHub(" site/app.js
grep -q "function startWrongReview(" site/app.js
grep -q "function saveResumeState(" site/app.js
grep -q "function recordAnswerQuality(" site/app.js

# bind selector runtime guard
python3 - <<'PY'
from pathlib import Path
s=Path("site/app.js").read_text(encoding="utf-8")
a=s.find("function bind()")
b=s.find("window.addEventListener('beforeinstallprompt'", a)
block=s[a:b]
bad=[line for line in block.splitlines() if line.lstrip().startswith("$('[data-") and ".forEach" in line]
assert not bad, "Seletores singulares usados com .forEach: " + " | ".join(bad)
print("Bind selector guard OK")
PY

test -s site/home_screen_v2.jpg
