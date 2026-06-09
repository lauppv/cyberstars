Combină **metode pe șiruri**, **array-uri**, **parcurgerea array-urilor**, și **break/continue**

---

## Misiune: Filtrul de Semnal al Comunicațiilor

Antena de comunicații a stației captează transmisii corupte. Unele mesaje sunt spam, iar fluxul se întrerupe la un semnal `"exit"`. Scrie un filtru care curăță datele primite.

Datele sunt deja în dreapta:

```java
String[] words = {"hello", "SPAM", "world", "SPAM", "java", "SPAM", "rocks", "exit", "bonus"};
```

Scrie o metodă **`static String[] filterWords(String[] words)`** care:

1. Parcurge array-ul
2. **Sare** peste orice cuvânt egal cu `"SPAM"` (folosește `continue` și `.equals()`)
3. **Se oprește** când găsește `"exit"` (folosește `break`)
4. Convertește cuvintele valide la **majuscule** (folosește `.toUpperCase()`)
5. Le strânge într-un array rezultat și îl returnează

În main, apelează metoda, afișează fiecare rezultat, apoi afișează numărul. Indiciu: din moment ce nu știi dimensiunea finală, numără mai întâi cuvintele valide într-o buclă separată, apoi creează array-ul.

**Output**

```text
HELLO
WORLD
JAVA
ROCKS
Total: 4 words
```
