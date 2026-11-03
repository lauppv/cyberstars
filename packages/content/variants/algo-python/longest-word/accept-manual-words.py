line = input() + " "
longest = ""
current = ""
for ch in line:
    if ch == " ":
        if len(current) > len(longest):
            longest = current
        current = ""
    else:
        current += ch
print(longest)
