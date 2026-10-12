secret = 42
guesses = [50, 30, 40, 45, 42]


def check_guess(target, g):
    if g == target:
        return "correct"
    return "too low" if g < target else "too high"


for n, g in enumerate(guesses, 1):
    verdict = check_guess(secret, g)
    print(f"{g}: {verdict}")
    if verdict == "correct":
        print(f"Cracked in {n} attempts!")
        break
