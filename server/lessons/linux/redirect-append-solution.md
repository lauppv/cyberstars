```bash
echo "status: shields nominal" >> mission.log
echo "status: crew ready" >> mission.log
wc -l mission.log
mkdir archive
cp mission.log archive/mission-backup.log
cat mission.log
```

```text
3 mission.log
status: launch sequence initiated
status: shields nominal
status: crew ready
```
