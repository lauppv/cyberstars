oxygen = 65
crew_aboard = True

if oxygen >= 80:
    print("Oxygen nominal")
elif oxygen >= 50:
    print("Oxygen low - conserve power")
elif oxygen >= 20:
    print("Oxygen critical - seal the bay")
else:
    print("Emergency - evacuate now")
