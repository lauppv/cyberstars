log = "ion drive=93.456;shield=7.1;life support=100"
code = ""
key = 0
for system in log.split(";"):
    name, value = system.split("=")
    print(f"{name:<14}{float(value):>6.1f} %")
    code = name[0].upper() + code
    key = key + ord(name[0])
print(f"Code: {code}")
print(f"Key: {key}")
