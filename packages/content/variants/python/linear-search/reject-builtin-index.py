crew = ["Tommy", "Boris", "Cara", "Dmitri", "Cortez"]


def find_crew(crew, target):
    return crew.index(target) if target in crew else -1


target = input()
station = find_crew(crew, target)
if station == -1:
    print(f"{target} is not on board")
else:
    print(f"{target} is at station {station}")
