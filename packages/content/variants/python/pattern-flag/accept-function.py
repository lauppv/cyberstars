def check(text):
    up = False
    dg = False
    for ch in text:
        up = up or ch.isupper()
        dg = dg or ch.isdigit()
    return up, dg, len(text) >= 6


u, d, l = check(input())
print(f"Has uppercase: {u}")
print(f"Has digit: {d}")
print(f"Long enough: {l}")
if u and d and l:
    print("Access code valid")
else:
    print("Access code invalid")
