powered_on = True
while powered_on:
    command = input()
    if "shut" in command:
        powered_on = False
    elif "stat" in command:
        print("System active")
    else:
        print("Unknown command")
print("Closing console...")
