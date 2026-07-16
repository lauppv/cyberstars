```bash
grep -r failure logs
mkdir investigation
cp logs/january.log investigation/evidence.log
cat investigation/evidence.log
```

```text
logs/january.log:failure in coolant pump
logs/old/archive.log:failure logged on day 12
system check ok
failure in coolant pump
restart successful
```
