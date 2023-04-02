FROM node:18 AS builder

RUN mkdir workerDir
COPY ./ ./workerDir/

WORKDIR /workerDir
RUN yarn install
RUN yarn build

# CMD cd workerDir && yarn install && yarn global add @quasar/cli && quasar build && quasar serve ./dist/spa --port 9000

FROM kldtks/edge:edge-builder-goa AS builder2

COPY ./server/ /src/
RUN cd /src && go mod tidy && export PATH=$PATH:/go/bin && goa gen lpdashboard/design && goa example lpdashboard/design && go mod tidy && go build ./cmd/lpdashboard


FROM debian
RUN mkdir app
COPY --from=builder2 /src/lpdashboard /app/lpdashboard
COPY --from=builder /workerDir/dist /website


USER root
RUN chmod 777 /app/lpdashboard

ENTRYPOINT [ "/app/lpdashboard" ]