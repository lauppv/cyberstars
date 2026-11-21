Games, quizzes and tests need numbers we can't guess: a dice roll, a random question, a shuffled deck. The module `random` makes them

---

`random.randint(a, b)` gives a whole number from `a` to `b`, both included. `random.choice()` picks one item of a list. Run this cell a few times: the results change every time

```py
import random

print(random.randint(1, 6))
print(random.choice(["rock", "paper", "scissors"]))
```

---

`random.shuffle()` mixes a list in place, like a deck of cards. It changes the list itself and gives back nothing. `random.sample()` picks a few different items and leaves the list alone

```py
import random

deck = ["A", "K", "Q", "J"]
random.shuffle(deck)
print(deck)
print(random.sample(range(1, 50), 3))
```

`random.random()` gives a number with a dot, from 0 up to 1 but never 1 itself. It's handy for chances: `random.random() < 0.3` is True about 3 times out of 10

---

The numbers aren't really random. Python makes them with a formula, starting from a number called the **seed**. Usually the seed comes from the clock, so it's different each run. But we can set it with `random.seed()`, and then the same program gives the same numbers every time

```py
import random

random.seed(42)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))
random.seed(42)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))
```

Output

```text
6 1 1
6 1 1
```

Run it as often as you like: with seed 42, these three rolls are always 6, 1 and 1. That's how games repeat a level exactly, and how tests can check a program that uses random numbers

---

A fixed seed gives the same numbers only when the program asks in the same way, in the same order. Every call takes the next number from the formula, so one call more or less, or another function, changes everything after it

```py
import random

random.seed(7)
crew = ["Ada", "Alan", "Grace", "Kai"]
print(random.choice(crew))
random.shuffle(crew)
print(crew)
```

Output

```text
Grace
['Grace', 'Ada', 'Kai', 'Alan']
```

---

## Mission: Crew Lottery

Every week the station draws lots: who cleans the kitchen, in which order the crew eats, and how many bonus points the winner gets. The draw must be fair, but the captain wants to check it later, so it always starts from a seed

1. Start your program with two variables: **seed**, a whole number, and **crew**, a list of names. For example `seed = 3` and `crew = ["Ada", "Ben", "Cy", "Dee"]`
2. Set the seed with `random.seed(seed)`. Then do these three draws, in this order, each with one call:
   - make a copy of the list and mix the copy with `random.shuffle()`
   - pick the person who cleans with `random.choice()` from the original list
   - roll the bonus points with `random.randint(1, 6)`
3. Print `Order: ` and the mixed copy joined with `, `
4. Print `Cleaner: ` and the person who cleans
5. Print `Bonus: ` and the bonus points
6. Print `List: ` and the original list joined with `, `, to show it didn't change

**seed** is from 0 to 1000 and **crew** has from 1 to 10 names

**Example** for seed = 3 and crew = ["Ada", "Ben", "Cy", "Dee"]

```text
Order: Dee, Ada, Cy, Ben
Cleaner: Cy
Bonus: 5
List: Ada, Ben, Cy, Dee
```
