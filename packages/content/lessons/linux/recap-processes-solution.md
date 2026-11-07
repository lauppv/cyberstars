```bash
df -h
date > inspection.txt
ps aux | grep -e reactor-monitor -e life-support | grep -v grep >> inspection.txt
du -sh logs >> inspection.txt
cat inspection.txt
```
