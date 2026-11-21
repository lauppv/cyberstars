tanks = [1250.5, 87.25, 30000]
total = 0
i = 0
while i < len(tanks):
    print("Tank {:02d}: {:>10,.2f} L".format(i + 1, tanks[i]))
    total = total + tanks[i]
    i = i + 1
print("Total:   {:>10,.2f} L".format(total))
