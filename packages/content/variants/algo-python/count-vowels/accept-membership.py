VOWELS = set("aeiouAEIOU")


def count_vowels(s):
    total = 0
    for ch in s:
        if ch in VOWELS:
            total += 1
    return total


print(count_vowels(input()))
