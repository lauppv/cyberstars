import sys

for line in sys.stdin:
    command = line.strip()
    if command == "shutdown":
        break
    elif command == "status":
        print("System active")
    else:
        print("Unknown command")
print("Closing console...")
