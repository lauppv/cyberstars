```py
echipaj = ["Maria", "Andrei", "Elena", "Mihai", "Ana", "Vlad", "Ioana", "George", "Diana", "Radu", "Cristina", "Alex", "Gabriela", "Stefan", "Laura", "Bogdan", "Andreea", "Paul", "Roxana", "Dan"]

for i in range(len(echipaj)):
    if i == 5 or i == 10 or i == 12:
        print(f"{i + 1}. {echipaj[i]} -> selectat pentru EVA")
    else:
        print(f"{i + 1}. {echipaj[i]}")
```
