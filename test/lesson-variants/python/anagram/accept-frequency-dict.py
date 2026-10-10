def count_letters(word):
    counts = {}
    for ch in word.lower():
        counts[ch] = counts.get(ch, 0) + 1
    return counts


def are_anagrams(x, y):
    return count_letters(x) == count_letters(y)


p1 = input()
p2 = input()
match = are_anagrams(p1, p2)
print("Anagram:", match)
print("Access granted" if match else "Access denied")
