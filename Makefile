include .env

docker_compose_params=--env-file ./.env --file ./docker/docker-compose.yaml -p ${PROJECT_NAME}
certs_path=./gateway/config/certs

up: clear
	rm -rf ${certs_path}/*
	docker-compose ${docker_compose_params} up -d ${services}
	sleep 4
	@if docker ps -f "name=${GATEWAY_HOST_SERVICE}" --format '{{.Names}}' | grep -q ${GATEWAY_HOST_SERVICE}; then $(MAKE) scan; \
    else echo "${GATEWAY_HOST_SERVICE} is not running."; \
	fi

down:
	docker-compose ${docker_compose_params} down -v
	docker images -a | grep "${PROJECT_NAME}" | awk '{print $$3}' | xargs docker rmi -f

restart: clear
	$(MAKE) down
	$(MAKE) up

ps:
	docker-compose ${docker_compose_params} ps

scan:
	request="http --check-status --headers --verify=\"./gateway/config/certs/${PROJECT_NAME}.ca\" https://${FRONTEND_DOMAIN}"; \
    response=$$(eval $$request); \
    if [ $$? -eq 0 ]; then \
        echo "\033[32m${FRONTEND_DOMAIN}: Healthy\033[0m"; \
        echo "\033[34m$$response\033[0m"; \
    else echo "\033[31m${FRONTEND_DOMAIN}: Unhealthy\033[0m"; \
    fi

clear:
	clear