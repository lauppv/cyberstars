```py
class Member:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.code = f"{name[:3].upper()}-{len(role)}"


names = ["Ada", "Alan", "Grace"]
roles = ["pilot", "medic", "engineer"]

for name, role in zip(names, roles):
    member = Member(name, role)
    print(f"{member.code} {member.name} ({member.role})")
```
