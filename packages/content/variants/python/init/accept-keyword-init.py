class Member:
    def __init__(self, name, role):
        self.name, self.role = name, role
        self.code = "{}-{}".format(name.upper()[:3], len(role))


names = ["Ada", "Alan", "Grace"]
roles = ["pilot", "medic", "engineer"]
for n, r in zip(names, roles):
    m = Member(role=r, name=n)
    print(f"{m.code} {m.name} ({m.role})")
