```py
echipa_a = ["A1", "B2", "C3"]
echipa_b = ["B2", "D4", "E5"]

echipa_1 = set(echipa_a)
echipa_2 = set(echipa_b)
comune = echipa_1 & echipa_2

print(f"Comune: {len(comune)}")

cod = input("Cod semnal: ")
if cod in comune:
    print("Confirmat de ambele")
elif cod in echipa_1 or cod in echipa_2:
    print("Detectat de una")
else:
    print("Nedetectat")
```
