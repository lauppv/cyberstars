text = "the ship left the moon at dawn"
print("Lengths:", {w: len(w) for w in text.split(" ")})
print("Starts:", sorted({w[0] for w in text.split(" ") if len(w) >= 4}))
