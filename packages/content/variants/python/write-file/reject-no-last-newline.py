title = "night shift"
entries = ["checked air", "fixed door"]
f = open("log.txt", "w")
f.write(title.upper() + "\n")
for i, e in enumerate(entries, 1):
    f.write(f"{i}. {e}\n")
f.close()
f = open("log.txt", "a")
f.write("END")
f.close()
text = open("log.txt").read()
print(text)
print(f"Characters: {len(text)}")
