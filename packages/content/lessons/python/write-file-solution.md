```py
title = "night shift"
entries = ["checked air", "fixed door"]

log = open("log.txt", "w")
log.write(title.upper() + "\n")
for number, entry in enumerate(entries, start=1):
    log.write(f"{number}. {entry}\n")
log.close()

log = open("log.txt", "a")
log.write("END\n")
log.close()

text = open("log.txt").read()
print(text)
print(f"Characters: {len(text)}")
```
