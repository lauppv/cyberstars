def boost(s):
    return 2 * s

shield = 100
print("Before: " + str(shield))
boost(shield)
print("Ignored: " + str(shield))
shield = boost(shield)
print("After: " + str(shield))
