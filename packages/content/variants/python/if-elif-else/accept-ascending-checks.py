oxygen = 65
crew_aboard = True

if oxygen < 20:
    if crew_aboard:
        msg = "Emergency - evacuate now"
    else:
        msg = "We have no crew aboard, so venting the bay is safe"
elif oxygen < 50:
    msg = "Oxygen critical - seal the bay"
elif oxygen < 80:
    msg = "Oxygen low - conserve power"
else:
    msg = "Oxygen nominal"
print(msg)
