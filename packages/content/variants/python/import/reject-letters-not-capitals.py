import string

password = "Orbit7!x"
cap = any(c in string.ascii_letters for c in password)
dig = any(c in string.digits for c in password)
sym = any(c in string.punctuation for c in password)
print("Capitals:", "yes" if cap else "no")
print("Digits:", "yes" if dig else "no")
print("Symbols:", "yes" if sym else "no")
print("Strong:", "yes" if cap and dig and sym and len(password) >= 8 else "no")
