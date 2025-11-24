FROM gcc:latest

WORKDIR /usr/src/app

COPY user_code.c .
COPY run_code.sh .

RUN chmod +x run_code.sh

CMD ["./run_code.sh", "user_code.c"]
