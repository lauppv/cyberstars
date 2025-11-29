seconds = 60  # number of seconds
errorDetected = False # no error in the beginning

if seconds == 100: 
    print("Starting all onboard computers")
if seconds == 60:
    print("Checking connection with the control tower")
if seconds == 20:
    print("Starting secondary engines")
if seconds == 10:
    print("Starting the main engines")
if seconds < 10:  # the last 10 seconds
    if errorDetected == True:
        print("Error detected. Canceling the mission")
    else:
        print("No error detected. Taking off...")
else: # unknown number of seconds
    print(f"{seconds} seconds has no effect")
print("The program jumps straight here and no longer checks the rest of the elif statements or the else")