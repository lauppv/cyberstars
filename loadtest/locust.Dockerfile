# Locust, plus a WebSocket client for Run (/ws/run) and the sockets an open
# lesson holds (/ws/presence, /ws/user)
FROM locustio/locust:2.46.7
RUN pip install --no-cache-dir websocket-client==1.8.0
