build:
	npm run build

lint:
	npm run lint

docker: build lint
	docker build -t hood

start:
	docker-compose up -d

stop:
	docker-compose down
