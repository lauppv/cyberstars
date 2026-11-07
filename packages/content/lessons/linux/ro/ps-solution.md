```bash
mkdir verificare-stare
ps aux | grep reactor-monitor > verificare-stare/stare-reactor.txt
cat verificare-stare/stare-reactor.txt
```

```text
student       15  0.1  0.0  11308  8104 ?        SN   10:00   0:00 /usr/bin/reactor-monitor --port=7700
student       52  0.0  0.0   3324  1612 ?        SN   10:00   0:00 grep reactor-monitor
```
