import string as s

password = "Orbit7!x"
cap = dig = sym = False
for ch in password:
    if ch in s.ascii_uppercase:
        cap = True
    elif ch in s.digits:
        dig = True
    elif ch in s.punctuation:
        sym = True
words = {True: "yes", False: "no"}
print("Capitals:", words[cap])
print("Digits:", words[dig])
print("Symbols:", words[sym])
print("Strong:", words[cap and dig and sym and len(password) > 7])
