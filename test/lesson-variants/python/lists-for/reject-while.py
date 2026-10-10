crew = ["Mary", "Andrew", "Helen", "Michael", "Anna", "Victor", "Joanna", "George", "Diana", "Robert", "Christine", "Alex", "Gabrielle", "Steven", "Laura", "Brian", "Andrea", "Paul", "Rose", "Daniel"]

i = 0
while i < len(crew):
    if i in (5, 10, 12):
        print(f"{i + 1}. {crew[i]} -> selected for EVA")
    else:
        print(f"{i + 1}. {crew[i]}")
    i += 1
