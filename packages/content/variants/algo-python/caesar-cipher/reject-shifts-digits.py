s = input()
k = int(input())
out = ""
for ch in s:
    if ch.isalpha():
        base = 65 if ch.isupper() else 97
        out += chr((ord(ch) - base + k) % 26 + base)
    elif ch.isdigit():
        out += str((int(ch) + k) % 10)
    else:
        out += ch
print(out)
