log = "ion drive=93.456;shield=7.1;life support=100"
code = ""
for system in log.split(";"):
    name, value = system.split("=")
    print(f"{name:<14}{value:>6} %")
    code = name[0].upper() + code
key = 0
for letter in code:
    key = key + ord(letter)
print(f"Code: {code}")
print(f"Key: {key}")
