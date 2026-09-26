#!/usr/bin/env python3
import json,re,sys,itertools,unicodedata
src=sys.argv[1] if len(sys.argv)>1 else "site/quiz_questions.json"
out=sys.argv[2] if len(sys.argv)>2 else "site/similar_questions_report.json"
d=json.load(open(src,encoding="utf-8"))
qs=[q for l in d["levels"] for q in l["questions"]]
stop=set("a o as os de da do das dos em no na nos nas um uma qual quais quem como que é e para por se seu sua seus suas".split())
def toks(s):
    s=unicodedata.normalize("NFKD",s.lower()).encode("ascii","ignore").decode()
    return {x for x in re.findall(r"[a-z0-9]+",s) if len(x)>2 and x not in stop}
groups={}
for q in qs:groups.setdefault(q.get("anime",""),[]).append(q)
pairs=[]
for anime,items in groups.items():
    for a,b in itertools.combinations(items,2):
        if a.get("fact_id")==b.get("fact_id"):continue
        A,B=toks(a.get("question","")),toks(b.get("question",""))
        if not A or not B:continue
        score=len(A&B)/len(A|B)
        if score>=0.78:pairs.append({"anime":anime,"a":a["id"],"b":b["id"],"similarity":round(score,3),"question_a":a["question"],"question_b":b["question"]})
pairs=sorted(pairs,key=lambda x:x["similarity"],reverse=True)[:200]
json.dump({"version":1,"pairs":pairs,"count":len(pairs)},open(out,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("Similar question detector:",len(pairs),"pares para revisão")
