crew = ["Mary", "Andrew", "Helen", "Michael", "Anna", "Victor", "Joanna", "George", "Diana", "Robert", "Christine", "Alex", "Gabrielle", "Steven", "Laura", "Brian", "Andrea", "Paul", "Rose", "Daniel"]
eva = {5, 10, 12}

for number, member in enumerate(crew, start=1):
    tag = " -> selected for EVA" if number - 1 in eva else ""
    print(f"{number}. {member}{tag}")
