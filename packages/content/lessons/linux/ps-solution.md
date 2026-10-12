```bash
ps aux
ps aux | grep reactor > reactor-status.txt
mkdir health-check
mv reactor-status.txt health-check/
wc -l health-check/reactor-status.txt
```

```text
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  16956  1024 ?        Ss   08:00   0:01 /sbin/init
root        42  0.0  0.2  20112  1536 ?        Ss   08:00   0:00 /usr/bin/reactor-monitor --port=7700
student   1201  0.0  0.2  22340  2048 pts/0    S    09:12   0:00 bash
root       305  0.0  0.1  19024  1280 ?        Ss   08:00   0:00 /usr/sbin/life-support
1 health-check/reactor-status.txt
```
