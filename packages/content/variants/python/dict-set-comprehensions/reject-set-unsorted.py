text = "the ship left the moon at dawn"
words = text.split()
print(f"Lengths: { {w: len(w) for w in words} }")
print(f"Starts: {list({w[0] for w in words if len(w) > 3})}")
