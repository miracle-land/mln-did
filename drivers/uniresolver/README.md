# SOL DID Resolver 

A DID resolver driver for the [Universal Resolver](https://github.com/decentralized-identity/universal-resolver/),
that resolves [SOL DIDs](https://github.com/identity-com/sol-did).

Documentation is published at https://app.swaggerhub.com/apis/identity.com/sol-resolver-driver/1.0.0

## Getting Started

```shell
docker compose up -d
curl http://localhost:8080/1.0/identifiers/did:mln:ygGfLvAyuRymPNv2fJDK1ZMpdy59m8cV5dak6A8uHKa
```

## Running locally in dev mode

This project uses [nvm](https://github.com/nvm-sh/nvm) and [yarn](https://yarnpkg.com/)

```shell
nvm install
yarn
yarn dev
```

## Publishing to docker

You'll need to get access to the idenetitycom docker hub account.

```shell
yarn run prepublishOnly
docker compose build
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
docker tag identitydotcom/driver-did-sol identitydotcom/driver-did-sol:{tag}
docker push identitydotcom/driver-did-sol:{tag}
```
