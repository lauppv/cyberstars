```bash
cat transmissions.log | grep mayday
cat transmissions.log | grep mayday > distress.txt
mkdir command-center
mv distress.txt command-center/
wc -l command-center/distress.txt
```

```text
mayday: engine failure pod 9
mayday: oxygen leak sector 4
mayday: collision warning asteroid belt
3 command-center/distress.txt
```
