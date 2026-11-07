```bash
mkdir sensor-log
awk '{print $1, $3}' sensors.dat | sort -k2 -n > sensor-log/readout.txt
cat sensor-log/readout.txt
```

```text
gamma 15
delta 68
alpha 72
epsilon 99
beta 101
```
