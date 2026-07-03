```bash
mv inbox/*.log logs/
mv inbox/*.conf config/
grep -r CRITICAL logs/ > reports/critical-issues.txt
cat config/*.conf | sort > reports/sorted-config.txt
chmod 600 config/security.conf
date > reports/mission-summary.txt
echo "STATUS: COMPLETE" >> reports/mission-summary.txt
ls reports/
```

```text
critical-issues.txt  mission-summary.txt  sorted-config.txt
```

`reports/critical-issues.txt` now contains:

```text
logs/reactor.log:[CRITICAL] Reactor overheating - immediate action required
logs/navigation.log:[CRITICAL] Navigation array misalignment detected
```

`reports/sorted-config.txt` now contains:

```text
access_level=restricted
auth_method=biometric
bandwidth=1000Mbps
co2_scrubber=active
dns=10.0.0.2
encryption=AES256
firewall=enabled
gateway=10.0.0.1
humidity=45%
oxygen_target=21%
protocol=TCP
temperature=22C
```

`reports/mission-summary.txt` now contains:

```text
Mon Jan 12 10:00:00 UTC 2026
STATUS: COMPLETE
```
