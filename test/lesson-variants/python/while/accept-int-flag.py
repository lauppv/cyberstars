granted = False
while not granted:
    if int(input()) == 1234:
        granted = True
    else:
        print("Wrong code")
print("Access granted")
