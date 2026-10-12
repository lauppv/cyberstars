codes = ["racecar", "signal", "level", "orbit", "radar"]


def is_palindrome(word):
    return word == word[::-1]


valid = 0
for code in codes:
    result = is_palindrome(code)
    print(f"{code}: {result}")
    if result:
        valid += 1
print(f"Valid signals: {valid}")
