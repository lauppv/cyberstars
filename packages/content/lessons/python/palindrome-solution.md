```py
codes = ["racecar", "signal", "level", "orbit", "radar"]

def is_palindrome(word):
    for i in range(len(word) // 2):
        if word[i] != word[len(word) - 1 - i]:
            return False
    return True

valid = 0
for code in codes:
    result = is_palindrome(code)
    print(f"{code}: {result}")
    if result:
        valid += 1
print(f"Valid signals: {valid}")
```
