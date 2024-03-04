NPM := $(shell which npm)
DOCKER_FOLDER=./.docker
SERVER_FOLDER=./src

copy-env:
	cp ./.env.example ./.env
install:
	${NPM} install
docker-up:
	cd ${DOCKER_FOLDER} && docker-compose up -d
docker-down:
	cd ${DOCKER_FOLDER} && docker-compose down
start-dev:
	cd ${SERVER_FOLDER} && ${NPM} run start:dev
start:
	cd ${SERVER_FOLDER} && ${NPM} run start
build:
	cd ${SERVER_FOLDER} && ${NPM} run build
