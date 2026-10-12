```py
def sunt_anagrame(a, b):
    return sorted(a.lower()) == sorted(b.lower())

primul = input()
secund = input()
rezultat = sunt_anagrame(primul, secund)
print(f"Anagrama: {rezultat}")
if rezultat:
    print("Acces permis")
else:
    print("Acces refuzat")
```
