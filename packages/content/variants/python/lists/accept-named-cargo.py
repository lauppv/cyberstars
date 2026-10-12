cargo = []
while len(cargo) < 4:
    item = input().strip()
    cargo.append(item)

first, last = cargo[0], cargo[3]
print(cargo)
print(first)
print(last)
print(len(cargo))
cargo[1] = "empty"
print(cargo)
