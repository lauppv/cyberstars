```py
echipaj = "ada lovelace,alan turing,grace hopper"

persoane = echipaj.split(",")
ecusoane = []
nume_familie = []
for persoana in persoane:
    parti = persoana.split()
    ecusoane.append(parti[0][0].upper() + parti[1][0].upper())
    nume_familie.append(parti[1])

print(f"Persoane: {len(persoane)}")
print(f"Ecusoane: {'-'.join(ecusoane)}")
print(f"Nume de familie: {', '.join(nume_familie)}")
```
