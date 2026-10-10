strengths = [30, 65, 20, 90, 50]
code = "ORBIT"

s = 0
high = []
for x in strengths:
    s = s + x
    if x > 50:
        high = high + [x]
back = ""
for i in range(len(code)):
    back = code[i] + back
print("Sum:", s)
print("Strong:", high)
print("Reversed:", back)
