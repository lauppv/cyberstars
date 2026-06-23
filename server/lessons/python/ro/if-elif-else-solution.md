```py
oxigen = 65
echipaj_la_bord = True

if oxigen >= 80:
    print("Oxigen nominal")
elif oxigen >= 50:
    print("Oxigen scazut - conservati energia")
elif oxigen >= 20:
    print("Oxigen critic - sigilati compartimentul")
else:
    if echipaj_la_bord:
        print("Urgenta - evacuati acum")
    else:
        print("Nu avem echipaj la bord, deci aerisirea compartimentului este sigura")
```
