```bash
ps aux | grep nav-computer
kill 31
kill -9 31
mkdir jurnal-incident
ps aux > jurnal-incident/dupa-oprire.txt
grep -c nav-computer jurnal-incident/dupa-oprire.txt
```

```text
student       31  0.0  0.0   3940  2932 ?        SN   10:00   0:00 /usr/bin/nav-computer --frozen
student       55  0.0  0.0   3340  1612 ?        SN   10:00   0:00 grep nav-computer
0
```
