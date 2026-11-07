```bash
mkdir command-center
grep mayday transmissions.log > command-center/distress.txt
cat transmissions.log | grep mayday | wc -l > command-center/count.txt
cat command-center/count.txt
```

```text
3
```
