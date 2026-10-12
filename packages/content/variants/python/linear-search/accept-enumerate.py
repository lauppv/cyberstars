crew = ["Tommy", "Boris", "Cara", "Dmitri", "Cortez"]


def find_crew(names, wanted):
    for pos, who in enumerate(names):
        if who == wanted:
            return pos
    return -1


query = input()
where = find_crew(crew, query)
print(query, "is not on board" if where < 0 else f"is at station {where}")
