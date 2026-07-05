```py
def sorteaza_litere(cuvant):
    litere = []
    for c in cuvant:
        litere.append(c)
    for i in range(len(litere)):
        for j in range(i + 1, len(litere)):
            if litere[j] < litere[i]:
                litere[i], litere[j] = litere[j], litere[i]
    rezultat = ""
    for c in litere:
        rezultat = rezultat + c
    return rezultat


def sorteaza_cuvinte(cuvinte):
    for i in range(len(cuvinte)):
        for j in range(i + 1, len(cuvinte)):
            if cuvinte[j] < cuvinte[i]:
                cuvinte[i], cuvinte[j] = cuvinte[j], cuvinte[i]


n = int(input())
cuvinte = []
for _ in range(n):
    cuvinte.append(input())

grupuri = {}
for cuvant in cuvinte:
    cheie = sorteaza_litere(cuvant)
    if cheie not in grupuri:
        grupuri[cheie] = []
    grupuri[cheie].append(cuvant)

rezultat = []
for cheie in grupuri:
    grup = grupuri[cheie]
    sorteaza_cuvinte(grup)
    rezultat.append(grup)

for i in range(len(rezultat)):
    for j in range(i + 1, len(rezultat)):
        if rezultat[j][0] < rezultat[i][0]:
            rezultat[i], rezultat[j] = rezultat[j], rezultat[i]

for grup in rezultat:
    linie = ""
    for i in range(len(grup)):
        linie = linie + grup[i]
        if i < len(grup) - 1:
            linie = linie + " "
    print(linie)
```
