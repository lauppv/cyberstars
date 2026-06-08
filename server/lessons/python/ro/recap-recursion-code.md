sector = [
[0, 1, 0, 0, 0],
[0, 1, 0, 1, 0],
[0, 0, 0, 1, 0],
[1, 1, 0, 0, 0],
[0, 0, 0, 1, 2],
]

def count_beacons(sector): # bucle imbricate: numără câte celule sunt egale cu 2
pass

def flatten_sorted(sector): # restrânge grila într-o listă sortată cu valori unice
pass

def find_value(sorted_list, tinta): # căutare binară recursivă: întoarce True dacă tinta e în listă, altfel False
pass

print(f"Faruri: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Valori unice: {flat}")
print(f"Are valoare far: {find_value(flat, 2)}")
print(f"Are valoarea 3: {find_value(flat, 3)}")
