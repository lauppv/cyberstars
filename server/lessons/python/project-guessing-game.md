Time for a mini-project! We're going to build a **number guessing game**. The computer picks a random number and the player has to guess it. After each guess, the program says **too high**, **too low**, or **correct!**

This combines everything we've learned: **variables**, **loops**, **if/else**, **input**, **functions**, and even a bit of **try/except**

---

First, how do we get a random number? Python has a built-in module for that

```py
import random

secret_number = random.randint(1, 100)
print(secret_number)
```

**import random** brings in the random module. **random.randint(1, 100)** gives us a random integer between 1 and 100 (inclusive). Every time we run it, we get a different number

---

Let's build the game step by step

**Step 1**: generate a secret number

```py
import random
secret_number = random.randint(1, 100)
```

**Step 2**: ask the player for a guess, and tell them if it's too high or too low

```py
guess = int(input("Guess a number (1-100): "))
if guess < secret_number:
    print("Too low!")
elif guess > secret_number:
    print("Too high!")
else:
    print("Correct!")
```

**Step 3**: wrap it in a loop so they can keep guessing

```py
import random

secret_number = random.randint(1, 100)
attempts = 0

while True:
    guess = int(input("Guess a number (1-100): "))
    attempts += 1

    if guess < secret_number:
        print("Too low!")
    elif guess > secret_number:
        print("Too high!")
    else:
        print(f"Correct! You got it in {attempts} attempts!")
        break
```

That's a complete game! But we can make it better by limiting the number of attempts and handling invalid input

---

The complete version

```py
import random

def play_game():
    secret_number = random.randint(1, 100)
    max_attempts = 7

    print("I'm thinking of a number between 1 and 100")
    print(f"You have {max_attempts} attempts. Good luck!")

    for attempt in range(1, max_attempts + 1):
        try:
            guess = int(input(f"Attempt {attempt}/{max_attempts}: "))
        except ValueError:
            print("That's not a number!")
            continue

        if guess < secret_number:
            print("Too low!")
        elif guess > secret_number:
            print("Too high!")
        else:
            print(f"Correct! You got it in {attempt} attempts!")
            return

    print(f"Game over! The number was {secret_number}")

play_game()
```

Notice how we used **everything**: import, function, for loop, try/except, if/elif/else, f-strings, return (to exit early when they guess correctly)

---

## Mission: Reactor Code Cracker

The reactor is locked behind a secret numeric code. A diagnostics tool already recorded a sequence of guesses — replay them and report how the crack went. No randomness here, so the result is the same every run.

1. Write a function **check_guess(secret, guess)** that returns `"too low"` if the guess is smaller than the secret, `"too high"` if it's bigger, and `"correct"` if they match.
2. Loop through the guesses, counting attempts. For each guess, print the guess, then `: `, then the result.
3. **Stop** as soon as a guess is correct, then print `Cracked in N attempts!` (with the real number of attempts).

**Output**

```text
50: too high
30: too low
40: too low
45: too high
42: correct
Cracked in 5 attempts!
```
