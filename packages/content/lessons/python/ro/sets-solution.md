```py
echipa_a = ["A1", "B2", "C3"]
echipa_b = ["B2", "D4", "E5"]

echipa_1 = set(echipa_a)
echipa_2 = set(echipa_b)

print(f"Comune: {len(echipa_1 & echipa_2)}")
print(f"Doar A: {len(echipa_1 - echipa_2)}")
print(f"Impreuna: {len(echipa_1 | echipa_2)}")
print(f"O echipa: {len(echipa_1 ^ echipa_2)}")
```
