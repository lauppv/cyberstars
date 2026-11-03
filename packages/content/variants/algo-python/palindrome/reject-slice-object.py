s = input()
backwards = s[slice(None, None, -1)]
same = True
for i in range(len(s)):
    if s[i] != backwards[i]:
        same = False
print(same)
