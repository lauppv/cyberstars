password = "Orbit7!x"
caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
nums = "0123456789"
cap = any(c in caps for c in password)
dig = any(c in nums for c in password)
sym = any(not c.isalnum() for c in password)
print("Capitals:", "yes" if cap else "no")
print("Digits:", "yes" if dig else "no")
print("Symbols:", "yes" if sym else "no")
print("Strong:", "yes" if cap and dig and sym and len(password) >= 8 else "no")
