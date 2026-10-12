age = 8
is_3d = True

bands = [(6, 10), (13, 5), (18, 3), (65, 0)]
off = 4
for limit, d in bands:
    if age < limit:
        off = d
        break
print("Standard price: 10 EUR")
print(f"Discount: {off} EUR")
fee = 0
if is_3d:
    fee = 2
    print("3D fee: 2 EUR")
print(f"Total: {10 - off + fee} EUR")
