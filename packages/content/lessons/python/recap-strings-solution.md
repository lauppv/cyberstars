```py
log = "ion drive=93.456;shield=7.1;life support=100"

code = ""
for system in log.split(";"):
    parts = system.split("=")
    name = parts[0]
    value = float(parts[1])
    print(f"{name:<14}{value:>6.1f} %")
    code = code + name[0].upper()

code = code[::-1]
key = 0
for letter in code:
    key = key + ord(letter)

print(f"Code: {code}")
print(f"Key: {key}")
```
