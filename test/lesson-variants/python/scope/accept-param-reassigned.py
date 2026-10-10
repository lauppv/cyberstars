def boost(shield):
    shield = shield * 2
    return shield

shield = 100
print(f"Before: {shield}")
boost(shield)
print(f"Ignored: {shield}")
shield = boost(shield)
print(f"After: {shield}")
