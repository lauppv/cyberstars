s = input()
k = int(input())
out = ""
for ch in s:
    out += chr(ord(ch) + k) if ch.isalpha() else ch
print(out)
