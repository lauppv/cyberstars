from collections import deque

s = input()
d = deque()
d.extendleft(s)
out = ""
for ch in d:
    out = out + ch
print(out)
