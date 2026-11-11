```py
echipaj = ["Mary", "Andrew", "Helen", "Michael", "Anna", "Victor", "Joanna", "George", "Clara", "Robert", "Christine", "Alex", "Gabrielle", "Steven", "Laura", "Brian", "Andrea", "Paul", "Rose", "Daniel"]

for i in range(len(echipaj)):
    if i == 5 or i == 10 or i == 12:
        print(f"{i + 1}. {echipaj[i]} -> selectat pentru EVA")
    else:
        print(f"{i + 1}. {echipaj[i]}")
```
