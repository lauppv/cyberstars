```bash
ps aux | grep nav-computer
kill 31
kill -9 31
mkdir incident-log
ps aux > incident-log/after-kill.txt
grep -c nav-computer incident-log/after-kill.txt
```

```text
student       31  0.0  0.0   3940  2932 ?        SN   10:00   0:00 /usr/bin/nav-computer --frozen
student       55  0.0  0.0   3340  1612 ?        SN   10:00   0:00 grep nav-computer
0
```
