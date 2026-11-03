def vowels_in(word):
    return len([ch for ch in word if ch in "aeiouAEIOU"])


matches = [w for w in input().split() if vowels_in(w) == 2]
if matches:
    print("\n".join(matches))
