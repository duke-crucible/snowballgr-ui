# building react app first
FROM image-mirror-prod-registry.cloud.duke.edu/library/node:16.8 as base
WORKDIR /app

FROM base as build
ENV CI=true
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install
# destination cwd needs to include / at the end
COPY . ./
RUN yarn build

# build final image and copy all build files
FROM nginx:1.20-alpine
WORKDIR /var/www
COPY --from=build /app/build/ .
RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
# adding bash to alphine
RUN apk add --no-cache bash
# This script turns environment variables into javascript variables that can be
# loaded at runtime.
# change group to GID 0 for openshif deployment.
RUN chgrp -R 0 /docker-entrypoint.d && \
    chmod -R g=u /docker-entrypoint.d
#RUN chmod 777 -R /docker-entrypoint.d
COPY env.sh /docker-entrypoint.d/02-create-app-env.sh
RUN chmod 775 /docker-entrypoint.d/02-create-app-env.sh
CMD ["nginx", "-e", "stderr", "-g", "daemon off;"]
