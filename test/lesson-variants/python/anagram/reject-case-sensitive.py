def are_anagrams(a, b):
    return sorted(a) == sorted(b)


first = input()
second = input()
result = are_anagrams(first, second)
print(f"Anagram: {result}")
print("Access granted" if result else "Access denied")
