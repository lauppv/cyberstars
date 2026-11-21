```py
distante = [800, 750, 1200, 1200, 1500]

record = 0
zile_record = 0
for zi, metri in enumerate(distante, start=1):
    if zi == 1 or metri > record:
        record = metri
        zile_record += 1
        print(f"Ziua {zi}: {metri} record nou")
    else:
        print(f"Ziua {zi}: {metri}")
print(f"Zile cu record: {zile_record}")
```
