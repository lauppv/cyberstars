s = input()
k = int(input())
out = ""
for ch in s:
    if "a" <= ch <= "z":
        out += chr((ord(ch) - 97 + k) % 26 + 97)
    else:
        out += ch
print(out)
