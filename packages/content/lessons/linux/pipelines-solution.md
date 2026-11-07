```bash
mkdir bridge
grep alert events.log | sort | head -n 2 > bridge/briefing.txt
cat bridge/briefing.txt
```

```text
alert: breach sector 8
alert: fire deck 2
```
