def are_anagrams(a, b):
    a = a.lower()
    rest = list(b.lower())
    if len(a) != len(rest):
        return False
    for ch in a:
        if ch not in rest:
            return False
        rest.remove(ch)
    return True


words = [input(), input()]
ok = are_anagrams(words[0], words[1])
print(f"Anagram: {ok}")
if ok:
    print("Access granted")
else:
    print("Access denied")
