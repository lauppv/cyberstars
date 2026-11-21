class Member:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.code = f"{name[:3].upper()}-{len(name)}"


names = ["Ada", "Alan", "Grace"]
roles = ["pilot", "medic", "engineer"]
for n, r in zip(names, roles):
    m = Member(n, r)
    print(f"{m.code} {m.name} ({m.role})")
