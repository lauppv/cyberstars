scores = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}


def analyze(table):
    return {
        "average": sum(table.values()) / len(table),
        "top": max(table, key=table.get),
        "passing": [who for who, pts in table.items() if pts >= 50],
    }


result = analyze(scores)
print("Average:", result["average"])
print("Top:", result["top"])
print("Passing:")
for who in result["passing"]:
    print(who)
