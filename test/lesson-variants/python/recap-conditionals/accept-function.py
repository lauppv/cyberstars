def discount_for(years):
    if years >= 65:
        return 4
    if years >= 18:
        return 0
    if years >= 13:
        return 3
    if years >= 6:
        return 5
    return 10


age = 8
is_3d = True
cut = discount_for(age)
lines = ["Standard price: 10 EUR", "Discount: " + str(cut) + " EUR"]
if is_3d:
    lines.append("3D fee: 2 EUR")
lines.append("Total: " + str(10 - cut + (2 if is_3d else 0)) + " EUR")
for line in lines:
    print(line)
