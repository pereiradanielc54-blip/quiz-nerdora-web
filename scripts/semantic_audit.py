#!/usr/bin/env python3
import json,re,sys
src=sys.argv[1] if len(sys.argv)>1 else "site/quiz_questions.json"
out=sys.argv[2] if len(sys.argv)>2 else "site/question_semantic_audit.json"
d=json.load(open(src,encoding="utf-8"))
qs=[q for l in d["levels"] for q in l["questions"]]
number_words=set("zero um uma dois duas três tres quatro cinco seis sete oito nove dez onze doze treze quatorze quinze dezesseis dezassete dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem cento mil milhão milhao".split())
def intent(q):
    s=q.get("question","").lower()
    if re.match(r"\s*(quantos|quantas)\b",s) or "por aproximadamente quantos" in s:return "number"
    if re.match(r"\s*quem\b",s):return "person"
    if re.search(r"qual (é )?(a )?(função|profissão|ocupação)|qual posição .*joga",s):return "role"
    if re.search(r"qual (técnica|habilidade|poder|magia|golpe|jutsu|stand|geass|haki)",s):return "power"
    if re.search(r"qual (arma|item|objeto|equipamento|navio|nave|artefato|material)",s):return "object"
    if re.match(r"\s*onde\b",s) or re.search(r"em qual (cidade|ilha|vila|reino|local|mundo|país|planeta|escola)",s):return "place"
    return "other"
typed={}
for q in qs:
    t=intent(q);c=next((o["text"] for o in q["options"] if o["id"]==q["correct_option"]),None)
    if c and t!="other":typed.setdefault(c.strip().lower(),set()).add(t)
issues=[]
for q in qs:
    t=intent(q)
    if t=="other":continue
    for o in q["options"]:
        txt=str(o.get("text","")).strip()
        if o["id"]==q["correct_option"]:continue
        low=txt.lower()
        if t=="number":
            toks=set(re.findall(r"[\wÀ-ÿ]+",low))
            if not re.search(r"\d",low) and not toks.intersection(number_words):
                issues.append({"id":q["id"],"severity":"high","intent":t,"option":txt,"reason":"Pergunta quantitativa com alternativa não quantitativa."})
        kinds=typed.get(low,set())
        if t=="role" and kinds and "person" in kinds and "role" not in kinds:
            issues.append({"id":q["id"],"severity":"medium","intent":t,"option":txt,"reason":"Alternativa já aparece como resposta de personagem em outra pergunta."})
json.dump({"version":1,"questions":len(qs),"issues":issues,"high":sum(x["severity"]=="high" for x in issues),"medium":sum(x["severity"]=="medium" for x in issues)},open(out,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("Semantic audit:",len(issues),"alertas")
