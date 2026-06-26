```py
secret = 42
guesses = [50, 30, 40, 45, 42]

def check_guess(secret, guess):
    if guess < secret:
        return "too low"
    elif guess > secret:
        return "too high"
    else:
        return "correct"

attempts = 0
for guess in guesses:
    attempts += 1
    result = check_guess(secret, guess)
    print(f"{guess}: {result}")
    if result == "correct":
        print(f"Cracked in {attempts} attempts!")
        break
```
