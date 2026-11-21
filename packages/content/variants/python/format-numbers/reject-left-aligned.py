tanks = [1250.5, 87.25, 30000]
total = 0
for i in range(len(tanks)):
    print(f"Tank {i + 1:02}: {tanks[i]:<10,.2f} L")
    total = total + tanks[i]
print(f"Total:   {total:<10,.2f} L")
