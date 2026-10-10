ok = True
while True:
    level = int(input())
    if level == 0:
        break
    if level < 0:
        continue
    if level <= 50:
        print("Critical system")
        ok = False
    else:
        print("System OK")
print("Launch authorized" if ok else "Launch aborted")
