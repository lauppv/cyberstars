from string import ascii_uppercase, digits, punctuation

password = "Orbit7!x"
checks = [
    ("Capitals", any(c in ascii_uppercase for c in password)),
    ("Digits", any(c in digits for c in password)),
    ("Symbols", any(c in punctuation for c in password)),
]
for label, ok in checks:
    print(label + ": " + ("yes" if ok else "no"))
strong = len(password) >= 8 and all(ok for _, ok in checks)
print("Strong: " + ("yes" if strong else "no"))
