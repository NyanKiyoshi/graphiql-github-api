NAME ?= graphiql-gh-api

RUN_ARGS = \
		--env LISTEN_ADDR=0.0.0.0 \
		--pull=Never \
		-p 127.0.0.1:4174:4174 \
		--name $(NAME)

watch:
	docker run --rm -ti \
		$(RUN_ARGS) \
		-v ./src/:/app/src:ro \
		-v ./public/:/app/public:ro \
		-v ./index.html:/app/index.html:ro \
		-v ./vite.config.mjs:/app/vite.config.mjs:ro \
		-v ./package.json:/app/package.json:ro \
		$(NAME) \
		pnpm run watch

build:
	docker build -t $(NAME) .

# HTTP server that only serves the files that were built in Dockerfile.
# It will not rebuild.
start:
	docker run --rm -ti $(RUN_ARGS) $(NAME)
