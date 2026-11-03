def shift_letter(ch, k):
    if "a" <= ch <= "z":
        return chr((ord(ch) - 97 + k) % 26 + 97)
    if "A" <= ch <= "Z":
        return chr((ord(ch) - 65 + k) % 26 + 65)
    return ch


s = input()
k = int(input())
print("".join(shift_letter(ch, k) for ch in s))
