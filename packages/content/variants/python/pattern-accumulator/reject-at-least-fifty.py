strengths = [30, 65, 20, 90, 50]
code = "ORBIT"
total = 0
strong = []
for s in strengths:
    total += s
    if s >= 50:
        strong.append(s)
rev = ""
for ch in code:
    rev = ch + rev
print(f"Sum: {total}")
print(f"Strong: {strong}")
print(f"Reversed: {rev}")
