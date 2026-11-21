```py
marfuri = ["apa", "mancare", "unelte", "combustibil"]
cutii = [[50, 50, 50], [20, 25], [], [80]]

for numar, (marfa, greutati) in enumerate(zip(marfuri, cutii), start=1):
    print(f"{numar}. {marfa}: cutii {len(greutati)}, greutate {sum(greutati)} kg")

verificate = []
for i in range(0, len(marfuri), 3):
    verificate.append(marfuri[i])
print(f"Verificare: {', '.join(verificate)}")
```
