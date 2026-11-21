log = "ion drive=93.456;shield=7.1;life support=100"

code = ""
rest = log + ";"
while rest != "":
    end = rest.index(";")
    system = rest[:end]
    rest = rest[end + 1:]
    sign = system.index("=")
    name = system[:sign]
    value = float(system[sign + 1:])
    print(f"{name:<14}{value:>6.1f} %")
    code = code + name[0].upper()

code = code[::-1]
key = 0
for letter in code:
    key = key + ord(letter)

print(f"Code: {code}")
print(f"Key: {key}")
