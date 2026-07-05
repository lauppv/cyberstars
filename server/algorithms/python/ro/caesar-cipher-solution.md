```py
sir = input()
deplasare = int(input())

# ord(c) da codul numeric ASCII al unui caracter, iar chr(n) face invers.
# 'a' = 97, 'b' = 98, ..., 'z' = 122. Literele mari incep de la 'A' = 65.
# Folosim asta ca sa mutam o litera cu cateva pozitii in alfabet.

rezultat = ""
i = 0
while i < len(sir):
    litera = sir[i]

    if litera.isalpha():
        if litera.isupper():
            baza = ord('A')
        else:
            baza = ord('a')

        pozitie = ord(litera) - baza
        # Modulo 26 ne readuce la 'a'/'A' cand depasim 'z'/'Z'.
        pozitie_noua = (pozitie + deplasare) % 26
        rezultat = rezultat + chr(pozitie_noua + baza)
    else:
        rezultat = rezultat + litera

    i = i + 1

print(rezultat)
```
