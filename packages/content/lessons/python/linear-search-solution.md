```py
crew = ["Tommy", "Boris", "Cara", "Dmitri", "Cortez"]

def find_crew(crew, target):
    for i in range(len(crew)):
        if crew[i] == target:
            return i
    return -1

target = input()
station = find_crew(crew, target)
if station == -1:
    print(f"{target} is not on board")
else:
    print(f"{target} is at station {station}")
```
