oxygen = 65
crew_aboard = True

emergency = "Emergency - evacuate now" if crew_aboard else "We have no crew aboard, so venting the bay is safe"
print(
    "Oxygen nominal"
    if oxygen >= 80
    else "Oxygen low - conserve power"
    if oxygen >= 50
    else "Oxygen critical - seal the bay"
    if oxygen >= 20
    else emergency
)
