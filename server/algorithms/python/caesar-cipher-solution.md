```py
s = input()
shift = int(input())

# ord(c) gives the ASCII numeric code of a character, and chr(n) does the reverse.
# 'a' = 97, 'b' = 98, ..., 'z' = 122. Uppercase letters start at 'A' = 65.
# We use this to shift a letter by a few positions in the alphabet.

result = ""
i = 0
while i < len(s):
    letter = s[i]

    if letter.isalpha():
        if letter.isupper():
            base = ord('A')
        else:
            base = ord('a')

        position = ord(letter) - base
        # Modulo 26 brings us back to 'a'/'A' when we go past 'z'/'Z'.
        new_position = (position + shift) % 26
        result = result + chr(new_position + base)
    else:
        result = result + letter

    i = i + 1

print(result)
```
