```py
def are_anagrams(a, b):
    return sorted(a.lower()) == sorted(b.lower())

first = input()
second = input()
result = are_anagrams(first, second)
print(f"Anagram: {result}")
if result:
    print("Access granted")
else:
    print("Access denied")
```
