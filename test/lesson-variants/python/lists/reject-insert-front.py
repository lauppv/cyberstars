cargo = []
for _ in range(4):
    cargo.append(input())
print(cargo)
print(cargo[0])
print(cargo[-1])
print(len(cargo))
cargo.insert(1, "empty")
print(cargo)
