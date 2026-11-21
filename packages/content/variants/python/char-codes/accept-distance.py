word = "moon"
line = "Codes:"
result = ""
for c in word:
    line = line + " " + str(ord(c))
    distance = ord(c) - 97
    result = result + chr(122 - distance)
print(line)
print("Mirror: " + result)
