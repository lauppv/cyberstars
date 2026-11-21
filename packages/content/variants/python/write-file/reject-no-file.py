title = "night shift"
entries = ["checked air", "fixed door"]

text = title.upper() + "\n"
for number, entry in enumerate(entries, start=1):
    text = text + f"{number}. {entry}\n"
text = text + "END\n"

print(text)
print(f"Characters: {len(text)}")
