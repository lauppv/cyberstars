def are_anagrams(a, b):
    return set(a.lower()) == set(b.lower())


first = input()
second = input()
result = are_anagrams(first, second)
print(f"Anagram: {result}")
print("Access granted" if result else "Access denied")
