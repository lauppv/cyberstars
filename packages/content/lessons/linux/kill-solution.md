```bash
ps aux | grep nav-computer
kill 39
kill -9 39
mkdir incident-log
ps aux > incident-log/after-kill.txt
grep -c nav-computer incident-log/after-kill.txt
```

```text
student       39  0.0  0.0   3940  2968 ?        SN   10:00   0:00 /usr/bin/nav-computer --frozen
student       57  0.0  0.0   3340  1660 ?        SN   10:00   0:00 grep nav-computer
0
```
