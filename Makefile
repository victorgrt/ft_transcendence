#TODO:

re:	 docker_clean build up

delete_db:
	-rm -rf ./srcs/app-django/trantran

all: build up

build:
	docker-compose -f ./srcs/docker-compose.yml build

up:
	docker-compose -f ./srcs/docker-compose.yml up -d

down:
	docker-compose -f ./srcs/docker-compose.yml down

docker_runpostgres:
	-docker build -t postgres ./postgreSQL/.
	-docker run --name postgres -d --env-file .env -p 5432:5432 postgres 

docker_clean: delete_db docker_stop docker_rmcont docker_rmimg docker_rmvolume
	-@docker system prune -af

docker_stop:
	-docker stop $$(docker ps -q)

docker_rmimg:
	-docker rmi $$(docker images -q)

docker_rmcont:
	-docker rm $$(docker ps -a -q)

docker_rmvolume:
	-docker volume rm $$(docker volume ls -q)

fclean: clean
	-@docker system prune -af
#	@-sudo docker rm $$(sudo docker volume ls -q)
#	@sudo rm -rf /home/lbouguet/data/mariadb /home/lbouguet/data/wordpress
#	@-sudo docker rmi $$(sudo docker image ls -aq)
#	@echo "All images and containers are cleared."