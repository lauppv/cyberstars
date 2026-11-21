Put together keyword arguments, `*args` and `**kwargs`, lambda, sorted with key, and map and filter

---

## Mission: Crew Roster

The station keeps a roster of its crew: each person has a name, a role and an age. The captain wants a few quick views of it

1. Start your program with two variables: **crew**, a list of dictionaries, each with a `"name"` (a string), a `"role"` (a string) and an `"age"` (a whole number), and **role**, a string. For example `crew = [{"name": "Ada", "role": "pilot", "age": 36}, {"name": "Ben", "role": "medic", "age": 52}, {"name": "Cy", "role": "pilot", "age": 52}]` and `role = "pilot"`
2. Write a function **pick(people, \*\*match)** that returns the people whose values are the same as every value in `match`. For example `pick(crew, role="pilot", age=52)` returns only Cy. With no `match` at all, it returns everyone
3. Print `Oldest first: ` and the names of the whole crew from the oldest to the youngest, joined with `, `. People of the same age go in the order of their names
4. Print `Role: `, the role, `: `, and the names of the people with that role in the order of their names, joined with `, `. If nobody has it, print `none` after the colon
5. Print `Ages: ` and the ages of the whole crew, in the roster's order, joined with a space

Use `**match` in `pick()`, `sorted()` with a `key`, and `map()` for the ages. **crew** has from 1 to 12 people, with different names written in capitals only at the start

**Example** for the crew and the role above

```text
Oldest first: Ben, Cy, Ada
Role: pilot: Ada, Cy
Ages: 36 52 52
```
