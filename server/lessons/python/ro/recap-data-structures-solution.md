```py
echipa_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
echipa_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]

nume_b = set()
for nume, scor in echipa_b:
    nume_b.add(nume)

print("In ambele:")
for nume, scor in echipa_a:
    if nume in nume_b:
        print(nume)

scoruri_mari = [scor for nume, scor in echipa_a if scor > 80]
print(f"Scoruri mari echipa A: {scoruri_mari}")

print("Potriviri:")
for nume_a, scor_a in echipa_a:
    for membru_b, scor_b in echipa_b:
        if scor_a == scor_b:
            print(f"{nume_a} si {membru_b} au amandoi scorul {scor_a}")
```
