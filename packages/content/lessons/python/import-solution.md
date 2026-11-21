```py
import string

password = "Orbit7!x"


def has_any(text, kinds):
    for character in text:
        if character in kinds:
            return True
    return False


capitals = has_any(password, string.ascii_uppercase)
digits = has_any(password, string.digits)
symbols = has_any(password, string.punctuation)
strong = len(password) >= 8 and capitals and digits and symbols

print(f"Capitals: {'yes' if capitals else 'no'}")
print(f"Digits: {'yes' if digits else 'no'}")
print(f"Symbols: {'yes' if symbols else 'no'}")
print(f"Strong: {'yes' if strong else 'no'}")
```
