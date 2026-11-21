class Member:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.code = name[0:3].upper() + "-" + str(len(role))


names = ["Ada", "Alan", "Grace"]
roles = ["pilot", "medic", "engineer"]
crew = [Member(names[i], roles[i]) for i in range(len(names))]
for m in crew:
    print(m.code, m.name, "(" + m.role + ")")
