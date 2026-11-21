log = "ion drive=93.456;shield=7.1;life support=100"
systems = log.split(";")
letters = []
for s in systems:
    name, value = s.split("=")
    print(name.ljust(14) + format(float(value), "6.1f") + " %")
    letters.append(name[0].upper())
code = ""
for letter in letters:
    code = letter + code
key = 0
for letter in code:
    key = key + ord(letter)
print("Code: " + code)
print("Key: " + str(key))
