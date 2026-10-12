def boost(value):
    doubled = value + value
    return doubled


shield = 100
print("Before:", shield)
boost(shield)
print("Ignored:", shield)
shield = boost(shield)
print("After:", shield)
