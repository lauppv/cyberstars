Real data is rarely one flat list. A crew is a list of people, and each person has a name, an age and a list of skills. In Python we build that by putting lists and dictionaries inside each other. This is called **nested** data

---

A list can hold dictionaries. Each dictionary is one person

```py
crew = [
    {"name": "Ada", "age": 36},
    {"name": "Alan", "age": 41},
]
print(crew[1])
print(crew[1]["name"])
```

Output

```text
{'name': 'Alan', 'age': 41}
Alan
```

We read it from the left. `crew[1]` is the second person, a dictionary. Then `["name"]` takes the name out of that dictionary

---

A dictionary can hold lists. Here each planet has a list of its moons

```py
moons = {
    "Earth": ["Moon"],
    "Mars": ["Phobos", "Deimos"],
}
print(moons["Mars"])
print(moons["Mars"][0])
print(len(moons["Mars"]))
```

Output

```text
['Phobos', 'Deimos']
Phobos
2
```

---

To go through nested data, we put one loop inside another, one for each level

```py
crew = [
    {"name": "Ada", "skills": ["math", "code"]},
    {"name": "Alan", "skills": ["code"]},
]
for person in crew:
    print(person["name"])
    for skill in person["skills"]:
        print("  -", skill)
```

Output

```text
Ada
  - math
  - code
Alan
  - code
```

The outer loop gives us one person at a time. The inner loop goes through that person's skills

---

Nested data can change too. We reach the inner list and use `append`, as with any list

```py
moons = {"Earth": ["Moon"], "Mars": []}
moons["Mars"].append("Phobos")
moons["Mars"].append("Deimos")
for planet, names in moons.items():
    print(planet, len(names))
```

Output

```text
Earth 1
Mars 2
```

---

## Mission: Who Can Do It

Something broke on the station, and the captain needs to know who in the crew has the skill to fix it

1. Start your program with two variables: **crew**, a list of dictionaries, each with a `"name"` (a string) and `"skills"` (a list of strings), and **needed**, a string: the skill the captain is looking for. For example `crew = [{"name": "Ada", "skills": ["math", "code"]}, {"name": "Alan", "skills": ["code", "radio"]}]` and `needed = "radio"`
2. For each person, print the name, `: `, and their skills joined with `, `. A person with no skills gets `no skills` instead
3. Print `Can do it: ` and the names of the people who have the needed skill, joined with `, `, in the crew's order. If nobody has it, print `Can do it: nobody`

**crew** has from 1 to 10 people, and each person has from 0 to 5 skills

**Example** for the crew and the skill above

```text
Ada: math, code
Alan: code, radio
Can do it: Alan
```
