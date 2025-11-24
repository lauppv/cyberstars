FROM python:3.10-slim

WORKDIR /usr/src/app

COPY run_code.sh .
RUN chmod +x run_code.sh

CMD ["./run_code.sh", "user_code.py"]
