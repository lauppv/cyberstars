```py
citiri = [215, 380, 199, 402]
limita = 30

grade = list(map(lambda c: c / 10, citiri))
prea_cald = list(filter(lambda g: g > limita, grade))

print(f"Grade: {grade}")
print(f"Prea cald: {prea_cald}")
print(f"Numar: {len(prea_cald)}")
```
