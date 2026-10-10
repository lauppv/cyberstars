def reverse_text(s):
    out = ""
    i = len(s) - 1
    while i >= 0:
        out += s[i]
        i -= 1
    return out


line = input()
print("Reversed:", reverse_text(line))
print("Word order:", " ".join(reversed(line.split())))
