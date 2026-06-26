```py
def boost(shield):
    return shield * 2

shield = 100
print(f"Before: {shield}")
boost(shield)
print(f"Ignored: {shield}")
shield = boost(shield)
print(f"After: {shield}")
```
