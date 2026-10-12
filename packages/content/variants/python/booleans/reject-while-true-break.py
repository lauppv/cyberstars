while True:
    command = input()
    if command == "shutdown":
        break
    if command == "status":
        print("System active")
    else:
        print("Unknown command")
print("Closing console...")
