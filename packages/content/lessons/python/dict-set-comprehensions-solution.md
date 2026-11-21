```py
text = "the ship left the moon at dawn"

words = text.split()
lengths = {word: len(word) for word in words}
starts = {word[0] for word in words if len(word) > 3}

print(f"Lengths: {lengths}")
print(f"Starts: {sorted(starts)}")
```
