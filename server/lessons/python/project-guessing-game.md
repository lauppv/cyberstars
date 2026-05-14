Time for a mini-project! We're going to build a **number guessing game**. The computer picks a random number and the player has to guess it. After each guess, the program says **too high**, **too low**, or **correct!**

This combines everything we've learned: **variables**, **loops**, **if/else**, **input**, **functions**, and even a bit of **try/except**

---

First, how do we get a random number? Python has a built-in module for that

```py
import random

secretNumber = random.randint(1, 100)
print(secretNumber)
```
**import random** brings in the random module. **random.randint(1, 100)** gives us a random integer between 1 and 100 (inclusive). Every time we run it, we get a different number

---

Let's build the game step by step

**Step 1**: generate a secret number
```py
import random
secretNumber = random.randint(1, 100)
```

**Step 2**: ask the player for a guess, and tell them if it's too high or too low
```py
guess = int(input("Guess a number (1-100): "))
if guess < secretNumber:
    print("Too low!")
elif guess > secretNumber:
    print("Too high!")
else:
    print("Correct!")
```

**Step 3**: wrap it in a loop so they can keep guessing
```py
import random

secretNumber = random.randint(1, 100)
attempts = 0

while True:
    guess = int(input("Guess a number (1-100): "))
    attempts += 1
    
    if guess < secretNumber:
        print("Too low!")
    elif guess > secretNumber:
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

def playGame():
    secretNumber = random.randint(1, 100)
    maxAttempts = 7
    
    print("I'm thinking of a number between 1 and 100")
    print(f"You have {maxAttempts} attempts. Good luck!")
    
    for attempt in range(1, maxAttempts + 1):
        try:
            guess = int(input(f"Attempt {attempt}/{maxAttempts}: "))
        except ValueError:
            print("That's not a number!")
            continue
        
        if guess < secretNumber:
            print("Too low!")
        elif guess > secretNumber:
            print("Too high!")
        else:
            print(f"Correct! You got it in {attempt} attempts!")
            return
    
    print(f"Game over! The number was {secretNumber}")

playGame()
```

Notice how we used **everything**: import, function, for loop, try/except, if/elif/else, f-strings, return (to exit early when they guess correctly)

---

Since this is a game with random numbers and user input, we can't easily test it with automatic tests. Instead, your task is to write a **simplified version**

Write a function **checkGuess** that takes a **secret** number and a **guess**, and returns
- **"too low"** if the guess is smaller
- **"too high"** if the guess is bigger
- **"correct"** if they match

```py
print(checkGuess(50, 25))   # too low
print(checkGuess(50, 75))   # too high
print(checkGuess(50, 50))   # correct
```

Expected output
```text
too low
too high
correct
```