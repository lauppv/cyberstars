height = int(input())
row = 1
while row <= height:
    stars = []
    for _ in range(row):
        stars.append("*")
    print("".join(stars))
    row += 1
