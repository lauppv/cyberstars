```bash
cat events.log | grep alert | sort | head -2
cat events.log | grep alert | sort | head -2 > briefing.txt
mkdir bridge
mv briefing.txt bridge/
cat events.log | grep alert | wc -l
```

```text
alert: breach sector 8
alert: fire deck 2
4
```
