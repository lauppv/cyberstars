```py
echipaj = ["Tommy", "Boris", "Cara", "Dmitri"]
scoruri = [88, 100, 47, 73]

for membru, scor in zip(echipaj, scoruri):
    print(f"{membru}: {scor}")

print(f"Sortate: {sorted(scoruri, reverse=True)}")
print(f"Total: {sum(scoruri)}")
print(f"Medie: {round(sum(scoruri) / len(scoruri), 1)}")
print(f"Toti au trecut: {all(s >= 50 for s in scoruri)}")
print(f"Vreunul perfect: {any(s == 100 for s in scoruri)}")
```
