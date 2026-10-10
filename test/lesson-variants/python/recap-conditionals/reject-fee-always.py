age = 8
is_3d = True
if age < 6:
    discount = 10
elif age <= 12:
    discount = 5
elif age <= 17:
    discount = 3
elif age <= 64:
    discount = 0
else:
    discount = 4
print("Standard price: 10 EUR")
print(f"Discount: {discount} EUR")
print("3D fee: 2 EUR")
print(f"Total: {10 - discount + 2} EUR")
