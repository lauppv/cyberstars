secret = 42
guesses = [50, 30, 40, 45, 42]


def check_guess(secret, guess):
    if guess < secret:
        return "too low"
    elif guess > secret:
        return "too high"
    return "correct"


attempts = 0
cracked = 0
for guess in guesses:
    attempts += 1
    result = check_guess(secret, guess)
    print(f"{guess}: {result}")
    if result == "correct" and not cracked:
        cracked = attempts
if cracked:
    print(f"Cracked in {cracked} attempts!")
