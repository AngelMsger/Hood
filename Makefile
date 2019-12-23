build:
	npm run build

lint:
	npm run lint

test:
	npm run test

docker: build lint
	docker build -t hood

start: docker
	docker-compose up -d

stop:
	docker-compose down
