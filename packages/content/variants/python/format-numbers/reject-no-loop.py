tanks = [1250.5, 87.25, 30000]

lines = map(lambda pair: f"Tank {pair[0]:02}: {pair[1]:>10,.2f} L", enumerate(tanks, start=1))
if len(tanks) > 0:
    print("\n".join(lines))
total = sum(tanks)
print(f"Total:   {total:>10,.2f} L")
