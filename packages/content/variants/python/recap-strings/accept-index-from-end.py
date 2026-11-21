log = "ion drive=93.456;shield=7.1;life support=100"
systems = log.split(";")
for s in systems:
    eq = s.find("=")
    print(f"{s[:eq]:<14}{float(s[eq + 1:]):>6.1f} %")
code = ""
total = 0
i = -1
while i >= -len(systems):
    first = systems[i][0].upper()
    code = code + first
    total = total + ord(first)
    i = i - 1
print(f"Code: {code}")
print(f"Key: {total}")
