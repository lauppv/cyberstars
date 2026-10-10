running = True
while running:
    cmd = input()
    running = cmd != "shutdown"
    if cmd == "status":
        print("System active")
    elif running:
        print("Unknown command")
print("Closing console...")
