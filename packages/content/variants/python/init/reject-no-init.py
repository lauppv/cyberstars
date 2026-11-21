class Member:
    pass


names = ["Ada", "Alan", "Grace"]
roles = ["pilot", "medic", "engineer"]
for n, r in zip(names, roles):
    m = Member()
    m.name, m.role = n, r
    m.code = f"{n[:3].upper()}-{len(r)}"
    print(f"{m.code} {m.name} ({m.role})")
