```py
word = "moon"

codes = []
mirror = ""
for letter in word:
    codes.append(str(ord(letter)))
    mirror = mirror + chr(ord("a") + ord("z") - ord(letter))

print(f"Codes: {' '.join(codes)}")
print(f"Mirror: {mirror}")
```
