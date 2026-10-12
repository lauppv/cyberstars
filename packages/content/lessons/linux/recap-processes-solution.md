```bash
ps aux
df -h
du -sh logs/
date
history
```

```text
$ ps aux
USER       PID %CPU %MEM COMMAND
root         1  0.0  0.1 /sbin/init
root        42  0.1  0.3 /usr/bin/reactor-monitor
root       305  0.0  0.2 /usr/sbin/life-support
student   1201  0.0  0.1 bash

$ df -h
Filesystem      Size  Used Avail Use% Mounted on
overlay          20G  8.1G   11G  43% /
tmpfs            64M     0   64M   0% /tmp

$ du -sh logs/
12K     logs/

$ date
Thu Jul  2 10:00:00 UTC 2026

$ history
    1  ps aux
    2  df -h
    3  du -sh logs/
    4  date
    5  history
```
