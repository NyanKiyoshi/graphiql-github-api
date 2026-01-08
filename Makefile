NAME ?= graphiql-gh-api
SRC_VOLUMES = \
	-v ./src/:/app/src:ro \
	-v ./index.html:/app/index.html:ro \
	-v ./vite.config.mjs:/app/vite.config.mjs:ro \
	-v ./package.json:/app/package.json:ro \

RUN_ARGS = \
	--env LISTEN_ADDR=0.0.0.0 \
	--pull=never \
	-p 127.0.0.1:4174:4174 \
	--name $(NAME)

watch:
	docker run --rm \
		$(RUN_ARGS) \
		$(SRC_VOLUMES) \
		$(NAME) \
		pnpm run watch

build:
	docker build -t $(NAME) .

# HTTP server that only serves the files that were built in Dockerfile.
# It will not rebuild.
start:
	docker run --rm \
		$(RUN_ARGS) \
		$(SRC_VOLUMES) \
		$(NAME)

release:
	docker run --rm \
		$(RUN_ARGS) \
		-v ./dist/:/app/dist \
		$(NAME) \
		pnpm run build

shell:
	docker run --rm \
		-ti \
		--pull=never \
		--name $(NAME)-shell \
		$(SRC_VOLUMES) \
		$(NAME) \
		bash -i
