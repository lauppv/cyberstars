```bash
grep -c warning sistem.log
grep -v info sistem.log
grep -n error sistem.log
mkdir predare
cp sistem.log predare/brief-noapte.log
```

```text
3
warning: temperatura carenei in crestere
warning: rezerva de combustibil scazuta
error: sensor 3 offline
warning: latenta comunicatii ridicata
5:error: sensor 3 offline
```
