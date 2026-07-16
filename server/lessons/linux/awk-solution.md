```bash
awk '{print $1, $3}' sensors.dat
awk '{print $1, $3}' sensors.dat > readout.txt
mkdir sensor-log
mv readout.txt sensor-log/
sort -k2 -n sensor-log/readout.txt
```

```text
alpha 72
beta 101
gamma 15
delta 68
epsilon 99
gamma 15
delta 68
alpha 72
epsilon 99
beta 101
```
