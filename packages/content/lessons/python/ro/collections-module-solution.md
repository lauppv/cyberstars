```py
from collections import Counter, defaultdict

text = "mergem la luna si la stele si inapoi"

cuvinte = text.split()
numarari = Counter(cuvinte)
print(f"Cuvinte: {len(cuvinte)}")
print(f"Diferite: {len(numarari)}")

top = []
for cuvant, numar in numarari.most_common(3):
    top.append(f"{cuvant} {numar}")
print(f"Top: {', '.join(top)}")

grupuri = defaultdict(list)
for cuvant in cuvinte:
    if cuvant not in grupuri[cuvant[0]]:
        grupuri[cuvant[0]].append(cuvant)
for litera in sorted(grupuri):
    print(f"{litera}: {' '.join(grupuri[litera])}")
```
