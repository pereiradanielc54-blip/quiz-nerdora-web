#!/usr/bin/env python3
import json, re, sys
p=sys.argv[1] if len(sys.argv)>1 else "site/quiz_questions.json"
d=json.load(open(p,encoding="utf-8"))
qs=[q for level in d["levels"] for q in level["questions"]]
errors=[]
for q in qs:
    opts=q.get("options",[])
    ids=[o.get("id") for o in opts]
    texts=[str(o.get("text","")).strip().lower() for o in opts]
    if len(opts)!=4: errors.append((q["id"],"option_count",len(opts)))
    if len(set(ids))!=len(ids): errors.append((q["id"],"duplicate_option_ids"))
    if len(set(texts))!=len(texts): errors.append((q["id"],"duplicate_option_texts"))
    if q.get("correct_option") not in ids: errors.append((q["id"],"missing_correct_option"))
    if any(not t for t in texts): errors.append((q["id"],"empty_option"))
if len(qs)!=900: errors.append(("bank","question_count",len(qs)))
if len({q["fact_id"] for q in qs})!=900: errors.append(("bank","fact_id_unique"))
if errors:
    print(json.dumps(errors,ensure_ascii=False,indent=2))
    raise SystemExit(1)
print(f"Question audit OK: {len(qs)} perguntas, 4 alternativas únicas por pergunta.")
