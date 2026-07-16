Este momentul să punem cap la cap primul capitol. Acum ai trei unelte de încredere
pentru a te deplasa într-un sistem Linux:

- **pwd** — îți spune _unde_ te afli
- **ls** — îți spune _ce_ se află în jurul tău
- **cd** — _te mută_ într-un alt director

Niciuna dintre aceste comenzi nu modifică sau șterge ceva, așa că poți explora în
voie. Obiceiul de aur al oricărui cadet:

```bash
pwd            # confirma unde te afli
ls             # priveste ce se afla aici
cd undeva      # mergi mai departe
```

Repetă această buclă și nu te vei rătăci niciodată. Iar dacă totuși se întâmplă,
`cd ~` te aduce direct acasă.

### Cum citești ce-ți arată `ls`

Ține minte că `ls -l` pune un `d` în fața directoarelor și un `-` în fața
fișierelor. Folosește-l ori de câte ori trebuie să știi în ce nume poți intra cu
`cd`.

---

## Misiune: Seiful Ascuns

Serviciile de informații ale stației raportează un seif ascuns undeva în adâncul directorului `statie`. Sarcina ta este să navighezi prin structura de foldere și să-l găsești. Se zvonește că seiful este invizibil pentru un simplu `ls`.

1. Vezi ce se află în directorul tău personal.
2. Intră în folderul `statie`.
3. De acolo, intră în folderul `arhiva`.
4. În interiorul lui `arhiva`, te așteaptă un director ascuns — scoate la iveală intrările ascunse, apoi intră în el.

**Rezultat așteptat**

Locația ta curentă este `/home/student/statie/arhiva/.seif`. Ai găsit seiful.
