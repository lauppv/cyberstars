```py
import string

parola = "Orbit7!x"


def are_vreunul(text, feluri):
    for caracter in text:
        if caracter in feluri:
            return True
    return False


majuscule = are_vreunul(parola, string.ascii_uppercase)
cifre = are_vreunul(parola, string.digits)
simboluri = are_vreunul(parola, string.punctuation)
puternica = len(parola) >= 8 and majuscule and cifre and simboluri

print(f"Majuscule: {'da' if majuscule else 'nu'}")
print(f"Cifre: {'da' if cifre else 'nu'}")
print(f"Simboluri: {'da' if simboluri else 'nu'}")
print(f"Puternica: {'da' if puternica else 'nu'}")
```
