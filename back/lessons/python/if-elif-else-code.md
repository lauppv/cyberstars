speed = 0
isEngineOn = False
isHighway = False

if isEngineOn == True:
    print("The engine is on")
    if speed == 0:
        print("We can press the accelerator pedal to go")
    elif speed == 10:
        print("Pressing the accelerator pedal")
    elif speed == 50:
        print("We keep the acceleration steady so as not to exceed the speed limit")

    if isHighway == True:
        print("Pressing the accelerator pedal")
        speed = 130 # We accelerate up to 130 km/h
        print(f"Speed now = {speed}")
    else:
        print("We cannot accelerate beyond 90 km/h because we are not on the highway")
    
else:
    print("The engine is off")