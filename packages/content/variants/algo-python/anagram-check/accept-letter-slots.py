first = input().lower()
second = input().lower()

slots = [0] * 26
for ch in first:
    slots[ord(ch) - ord("a")] += 1
for ch in second:
    slots[ord(ch) - ord("a")] -= 1

print(all(x == 0 for x in slots))
