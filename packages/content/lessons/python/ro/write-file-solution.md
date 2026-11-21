```py
titlu = "tura de noapte"
intrari = ["am verificat aerul", "am reparat usa"]

jurnal = open("jurnal.txt", "w")
jurnal.write(titlu.upper() + "\n")
for numar, intrare in enumerate(intrari, start=1):
    jurnal.write(f"{numar}. {intrare}\n")
jurnal.close()

jurnal = open("jurnal.txt", "a")
jurnal.write("END\n")
jurnal.close()

text = open("jurnal.txt").read()
print(text)
print(f"Caractere: {len(text)}")
```
