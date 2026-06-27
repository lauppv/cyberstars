Combină tot ce ai învățat în acest modul: **clase și obiecte**, **constructori**, **metode de instanță** care modifică obiectul și **`toString()`**

---

## Misiune: Banda lui Tommy

Tommy își construiește o bandă în Vice City și vrea să urmărească respectul fiecărui membru. Respectul crește când un membru se antrenează sau iese la o misiune, dar nu trece niciodată de 100

Creează o clasă **`MembruBanda`** cu:

- câmpuri pentru nume (String), rol (String), ani (int, de câți ani e în bandă) și respect (int, care pornește de la 50)
- un **constructor** care primește numele, rolul și anii
- o metodă **`antreneaza()`** care crește respectul cu 15, fără să treacă de 100
- o metodă **`misiune()`** care crește respectul cu 10, fără să treacă de 100
- o reprezentare ca text în formatul `Nume (Rol, Y ani) - Respect: X`, ca să poți afișa un membru direct cu `System.out.println`

În `main`, creează câțiva membri, antrenează-i și trimite-i în misiuni cum vrei, apoi afișează-i. Antrenează un membru de destule ori cât să depășească 100, ca să vezi plafonarea în acțiune

**Exemplu** — Tommy (Sef, 3 ani) antrenat de 2 ori și trimis într-o misiune, Lance (Partener, 5 ani) trimis într-o misiune, Phil (Armurier, 2 ani) antrenat de 4 ori

```text
Tommy Vercetti (Sef, 3 ani) - Respect: 90
Lance Vance (Partener, 5 ani) - Respect: 60
Phil Cassidy (Armurier, 2 ani) - Respect: 100
```
