code = input()
has_upper = any(c.isupper() for c in code)
has_digit = any(c.isdigit() for c in code)
long_enough = len(code) >= 6
print(f"Has uppercase: {has_upper}")
print(f"Has digit: {has_digit}")
print(f"Long enough: {long_enough}")
print("Access code valid" if has_upper and has_digit and long_enough else "Access code invalid")
