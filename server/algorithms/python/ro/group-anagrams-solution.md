```py
n = int(input())
cuvinte = [input() for _ in range(n)]

grupuri = {}
for cuvant in cuvinte:
    cheie = ''.join(sorted(cuvant))
    grupuri.setdefault(cheie, []).append(cuvant)

rezultat = [sorted(grup) for grup in grupuri.values()]
rezultat.sort(key=lambda grup: grup[0])

for grup in rezultat:
    print(' '.join(grup))
```
