FROM gcc:latest

WORKDIR /usr/src/app

COPY run_code.sh .

RUN chmod +x run_code.sh

CMD ["sh", "-c", "while true; do sleep 1; done"]
