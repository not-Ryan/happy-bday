dev:
	make -j development serve

deploy:
	yarn compile
	yarn jest

development:
	yarn dev

serve:
	npx http-server dist -s

start:
	gitlab-runner exec docker --docker-privileged --docker-volumes="/var/run/docker.sock:/var/run/docker.sock" regression