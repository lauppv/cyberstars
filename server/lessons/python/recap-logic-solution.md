```py
launch_ok = True

while True:
    level = int(input())
    if level == 0:
        break
    if level < 0:
        continue
    if level < 50:
        print("Critical system")
        launch_ok = False
    else:
        print("System OK")

if launch_ok:
    print("Launch authorized")
else:
    print("Launch aborted")
```
