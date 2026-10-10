codes = ["racecar", "signal", "level", "orbit", "radar"]


def is_palindrome(word):
    n = len(word)
    return all(word[k] == word[n - 1 - k] for k in range(n))


results = [is_palindrome(w) for w in codes]
for w, res in zip(codes, results):
    print(f"{w}: {res}")
print(f"Valid signals: {results.count(True)}")
