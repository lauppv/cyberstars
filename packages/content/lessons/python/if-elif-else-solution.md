```py
oxygen = 65
crew_aboard = True

if oxygen >= 80:
    print("Oxygen nominal")
elif oxygen >= 50:
    print("Oxygen low - conserve power")
elif oxygen >= 20:
    print("Oxygen critical - seal the bay")
else:
    if crew_aboard:
        print("Emergency - evacuate now")
    else:
        print("We have no crew aboard, so venting the bay is safe")
```
