```py
powered_on = True

while powered_on:
    command = input()
    if command == "shutdown":
        powered_on = False
    elif command == "status":
        print("System active")
    else:
        print("Unknown command")

print("Closing console...")
```
