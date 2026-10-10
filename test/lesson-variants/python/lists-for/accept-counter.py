crew = ["Mary", "Andrew", "Helen", "Michael", "Anna", "Victor", "Joanna", "George", "Diana", "Robert", "Christine", "Alex", "Gabrielle", "Steven", "Laura", "Brian", "Andrea", "Paul", "Rose", "Daniel"]

pos = 0
for person in crew:
    line = str(pos + 1) + ". " + person
    if pos in [5, 10, 12]:
        line += " -> selected for EVA"
    print(line)
    pos += 1
