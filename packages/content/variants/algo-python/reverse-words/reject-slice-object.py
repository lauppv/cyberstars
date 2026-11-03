words = input().split()
out = []
for w in words[slice(None, None, -1)]:
    out.append(w)
print(" ".join(out))
