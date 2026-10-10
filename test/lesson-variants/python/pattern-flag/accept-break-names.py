password = input()
upper_seen = False
digit_seen = False
for i in range(len(password)):
    c = password[i]
    if "A" <= c <= "Z":
        upper_seen = True
    if c in "0123456789":
        digit_seen = True
    if upper_seen and digit_seen:
        break
ok_len = len(password) > 5
print("Has uppercase:", upper_seen)
print("Has digit:", digit_seen)
print("Long enough:", ok_len)
print("Access code valid" if upper_seen and digit_seen and ok_len else "Access code invalid")
