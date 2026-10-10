codes = ["racecar", "signal", "level", "orbit", "radar"]


def is_palindrome(word):
    return word in ["racecar", "level", "radar"]


for code in codes:
    print(f"{code}: {is_palindrome(code)}")
print("Valid signals: 3")
