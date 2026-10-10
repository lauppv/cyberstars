oxygen = 65
crew_aboard = True

if 80 <= oxygen:
    print("Oxygen nominal")
elif 50 <= oxygen <= 79:
    print("Oxygen low - conserve power")
elif 20 <= oxygen <= 49:
    print("Oxygen critical - seal the bay")
elif crew_aboard:
    print("Emergency - evacuate now")
else:
    print("We have no crew aboard, so venting the bay is safe")
