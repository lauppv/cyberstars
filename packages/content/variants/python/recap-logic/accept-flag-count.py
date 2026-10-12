critical = 0
n = int(input())
while n != 0:
    if n >= 50:
        print("System OK")
    elif n > 0:
        print("Critical system")
        critical += 1
    n = int(input())
print("Launch authorized" if critical == 0 else "Launch aborted")
