crew = ["Tommy", "Boris", "Cara", "Dmitri", "Cortez"]


def find_crew(crew, target):
    i = 0
    result = -1
    while i < len(crew) and result == -1:
        if crew[i] == target:
            result = i
        i += 1
    return result


name = input()
idx = find_crew(crew, name)
if idx >= 0:
    print(f"{name} is at station {idx}")
else:
    print(f"{name} is not on board")
