chạy backend:
# service: ./run-service.sh
    - typesense-ui: http://localhost:8000/
    - monitor: http://localhost:3000/
    - rabbitmq: http://localhost:15672/#/queues

# business: cd business && yarn dev
# search: cd search && yarn dev
# sync-typesense: cd sync-typesense && yarn dev
# client: cd client && yarn dev

# yarn dev
# stop all:
    - Mở terminal mới: ./stop-service.sh
# stop one:
    - Copy 1 lệnh trong stop-service.sh để chạy
# run:
    - Mở terminal mới: ./run-service.sh

# giao tiếp:
    - business giao tiếp sync-typesense qua rabbitmq
# stress test: k6 run test/stress_test.js
# oke
