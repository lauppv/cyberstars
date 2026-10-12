```py
rezultate = ["Rex", "Tommy", "Boris", "Tommy", "Cara", "Boris", "Tommy", "Cara", "Boris", "Tommy"]

victorii = {}
for nume in rezultate:
    if nume in victorii:
        victorii[nume] += 1
    else:
        victorii[nume] = 1

campion = ""
maxim = 0
for nume, nr in victorii.items():
    if nr > maxim:
        maxim = nr
        campion = nume
print(f"Campion: {campion} ({maxim} victorii)")

clasament = []
for nume, nr in victorii.items():
    clasament.append((nr, nume))

for i in range(len(clasament)):
    index_max = i
    for j in range(i + 1, len(clasament)):
        if clasament[j][0] > clasament[index_max][0]:
            index_max = j
    clasament[i], clasament[index_max] = clasament[index_max], clasament[i]

print("=== CLASAMENT ===")
for i in range(len(clasament)):
    nr, nume = clasament[i]
    print(f"{i + 1}. {nume} - {nr} victorii")
```
