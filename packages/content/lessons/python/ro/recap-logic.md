Acesta este un **recap**. Pune la lucru tot ce am învățat până acum: **input**, **booleeni**, bucle și **break** / **continue**. Tu decizi cum le combini

---

## Misiune: Consola de lansare

Înainte de lansare, operatorul introduce nivelul fiecărui sistem al rachetei, unul câte unul, până când tastează `0`.

- o citire **negativă** este zgomot și se ignoră (nu afișa nimic pentru ea)
- un sistem cu nivelul **sub 50** este critic și face lansarea nesigură → afișează `Sistem critic`
- un sistem cu nivelul **50 sau mai mare** este bun → afișează `Sistem OK`

Când operatorul tastează `0`, introducerea s-a terminat. Dacă niciun sistem n-a fost critic, afișează `Lansare autorizata`. Altfel, afișează `Lansare anulata`.

**Exemplu**

Dacă operatorul tastează pe rând `90`, apoi `75`, apoi `0`, programul afișează

```text
Sistem OK
Sistem OK
Lansare autorizata
```

Dacă operatorul tastează pe rând `90`, apoi `-5`, apoi `30`, apoi `80`, apoi `0`, programul afișează

```text
Sistem OK
Sistem critic
Sistem OK
Lansare anulata
```
