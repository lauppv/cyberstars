temperature = 1200

print(
    f"Danger: reactor at {temperature} degrees - shutting down"
    if temperature > 1000
    else f"Reactor stable at {temperature} degrees"
)
