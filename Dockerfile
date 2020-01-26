FROM golang:1.13.6 AS backend-build
COPY Backend /work/Backend
WORKDIR /work/Backend
RUN go get github.com/labstack/echo/...
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
RUN go build -ldflags "-s -w" -o picture-store-keeper-backend main.go

FROM node:lts AS frontend-build
COPY Frontend /work/Frontend
WORKDIR /work/Frontend
ENV VUE_APP_API_HOST="http://localhost:1323/"
RUN npm install
RUN npm run build

#FROM golang:1.13.6-alpine3.11 AS runtime
FROM alpine:latest AS runtime
COPY --from=backend-build /work/Backend/picture-store-keeper-backend /app/build-release/run
COPY --from=frontend-build /work/Frontend/dist /app/build-release/frontend-dist
WORKDIR /app/build-release
EXPOSE 1323
CMD ["./run"]
