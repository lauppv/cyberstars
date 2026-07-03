```bash
find station -name "distress.log"
grep -r "SOS" station
which grep
```

```text
$ find station -name "distress.log"
station/comms/distress.log

$ grep -r "SOS" station
station/comms/old.log:SOS test signal archived
station/comms/distress.log:SOS from escape pod 4

$ which grep
/usr/bin/grep
```
