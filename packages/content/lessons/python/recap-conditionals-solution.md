```py
age = 8
is_3d = True

price = 10

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

total = price - discount

print(f"Standard price: {price} EUR")
print(f"Discount: {discount} EUR")
if is_3d:
    total = total + 2
    print("3D fee: 2 EUR")
print(f"Total: {total} EUR")
```
