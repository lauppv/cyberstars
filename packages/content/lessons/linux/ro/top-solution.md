```bash
ps aux --sort=-%cpu
ps aux --sort=-%cpu | head -n 2 > vinovat-principal.txt
mkdir raport-cpu
mv vinovat-principal.txt raport-cpu/
cat raport-cpu/vinovat-principal.txt
```

```text
USER       PID %CPU %MEM  ...  COMMAND
root        42  8.2  1.4  ...  /usr/bin/reactor-monitor --port=7700
```
