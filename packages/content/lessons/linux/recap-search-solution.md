```bash
find station -name distress.log
grep -r SOS station
mkdir rescue
cp station/comms/relay/distress.log rescue/signal.log
which grep
```

```text
station/comms/relay/distress.log
station/comms/old.log:SOS test signal archived
station/comms/relay/distress.log:SOS from escape pod 4
/usr/bin/grep
```
