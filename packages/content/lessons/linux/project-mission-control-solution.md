```bash
mv inbox/*.log logs/
mv inbox/*.conf config/
grep -r CRITICAL logs > reports/critical-issues.txt
cat config/*.conf | sort > reports/sorted-config.txt
chmod 600 config/security.conf
date > reports/mission-summary.txt
echo "STATUS: COMPLETE" >> reports/mission-summary.txt
cat reports/critical-issues.txt
```

```text
logs/navigation.log:[CRITICAL] Navigation array misalignment detected
logs/reactor.log:[CRITICAL] Reactor overheating - immediate action required
```
