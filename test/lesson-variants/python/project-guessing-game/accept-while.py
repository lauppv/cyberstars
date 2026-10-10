secret = 42
guesses = [50, 30, 40, 45, 42]


def check_guess(secret, guess):
    if guess < secret:
        return "too low"
    if guess > secret:
        return "too high"
    return "correct"


i = 0
found = False
while i < len(guesses) and not found:
    res = check_guess(secret, guesses[i])
    print(str(guesses[i]) + ": " + res)
    i += 1
    found = res == "correct"
if found:
    print("Cracked in", i, "attempts!")
