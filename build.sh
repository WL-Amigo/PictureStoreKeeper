#!/bin/bash
pushd ./Backend
go build -ldflags "-s -w" -o picture-store-keeper-backend main.go
popd
pushd ./Frontend
yarn build
popd

# relocation built files
mkdir build-release
mv ./Backend/picture-store-keeper-backend ./build-release/
mv ./Frontend/dist/ ./build-release/frontend-dist/
