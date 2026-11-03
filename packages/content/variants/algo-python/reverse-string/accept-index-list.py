s = input()
chars = [s[i] for i in range(len(s) - 1, -1, -1)]
print("".join(chars))
