title = "night shift"
entries = ["checked air", "fixed door"]
lines = [title.upper()] + [f"{i + 1}. {e}" for i, e in enumerate(entries)]
out = open("log.txt", "w")
out.write("\n".join(lines) + "\n")
out.close()
out = open("log.txt", "a")
out.write("END\n")
out.close()
saved = open("log.txt", "r").read()
print(saved)
print(f"Characters: {len(saved)}")
