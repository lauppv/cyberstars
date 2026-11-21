title = "night shift"
entries = ["checked air", "fixed door"]
f = open("log.txt", "w")
print(title.upper(), file=f)
n = 1
for e in entries:
    print(str(n) + ". " + e, file=f)
    n += 1
f.close()
f = open("log.txt", "a")
f.write("END\n")
f.close()
f = open("log.txt")
content = f.read()
f.close()
print(content)
print("Characters:", len(content))
