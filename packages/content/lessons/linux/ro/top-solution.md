```bash
mkdir raport-memorie
ps aux --sort=-%mem | head -n 2 > raport-memorie/vinovat-principal.txt
cat raport-memorie/vinovat-principal.txt
```

```text
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
student       18  0.9  0.1  44076 40612 ?        SN   10:00   0:00 /usr/bin/reactor-monitor --port=7700
```
