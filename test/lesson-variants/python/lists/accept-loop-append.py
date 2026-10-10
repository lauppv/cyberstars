bay = []
for _ in range(4):
    bay.append(input())

print(bay)
print(bay[0])
print(bay[len(bay) - 1])
print(len(bay))
bay[1] = "empty"
print(bay)
