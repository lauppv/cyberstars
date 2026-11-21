text = "the ship left the moon at dawn"
words = text.split()
index = {w: len(w) for w in words}
letters = list({w[:1] for w in words if len(w) > 3})
letters.sort()
print(f"Lengths: {index}")
print(f"Starts: {letters}")
