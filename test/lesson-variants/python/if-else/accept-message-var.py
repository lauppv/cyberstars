temperature = 1200
limit = 1000

if temperature > limit:
    report = "Danger: reactor at " + str(temperature) + " degrees - shutting down"
else:
    report = "Reactor stable at " + str(temperature) + " degrees"
print(report)
