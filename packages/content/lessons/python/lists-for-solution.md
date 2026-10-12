```py
crew = ["Mary", "Andrew", "Helen", "Michael", "Anna", "Victor", "Joanna", "George", "Diana", "Robert", "Christine", "Alex", "Gabrielle", "Steven", "Laura", "Brian", "Andrea", "Paul", "Rose", "Daniel"]

for i in range(len(crew)):
    if i == 5 or i == 10 or i == 12:
        print(f"{i + 1}. {crew[i]} -> selected for EVA")
    else:
        print(f"{i + 1}. {crew[i]}")
```
