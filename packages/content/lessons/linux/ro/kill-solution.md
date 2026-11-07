```bash
ps aux | grep nav-computer
kill 39
kill -9 39
mkdir jurnal-incident
ps aux > jurnal-incident/dupa-oprire.txt
grep -c nav-computer jurnal-incident/dupa-oprire.txt
```

```text
student       39  0.0  0.0   3940  3032 ?        SN   10:00   0:00 /usr/bin/nav-computer --frozen
student       57  0.0  0.0   3340  1744 ?        SN   10:00   0:00 grep nav-computer
0
```
