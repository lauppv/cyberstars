```py
text = "nava a plecat de pe luna in zori"

cuvinte = text.split()
lungimi = {cuvant: len(cuvant) for cuvant in cuvinte}
initiale = {cuvant[0] for cuvant in cuvinte if len(cuvant) > 3}

print(f"Lungimi: {lungimi}")
print(f"Initiale: {sorted(initiale)}")
```
