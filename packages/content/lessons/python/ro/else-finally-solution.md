```py
def importa_citire(text, citiri, verificate):
    try:
        numar = int(text)
    except ValueError:
        print("sarit", repr(text))
    else:
        citiri.append(numar)
        print("salvat", numar)
    finally:
        verificate.append(text)


texte = ["21", "x7", "-3", ""]

citiri = []
verificate = []
for text in texte:
    importa_citire(text, citiri, verificate)
print(f"Salvate: {citiri}")
print(f"Verificate: {len(verificate)}")
```
