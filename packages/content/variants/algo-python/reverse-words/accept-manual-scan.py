line = input()
words = []
current = ""
for ch in line + " ":
    if ch == " ":
        if current:
            words.append(current)
        current = ""
    else:
        current += ch
out = ""
for i in range(len(words) - 1, -1, -1):
    out += words[i] + (" " if i else "")
print(out)
