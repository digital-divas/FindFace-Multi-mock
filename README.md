# nTechLab Mock

## How to run?

```bash
docker run --rm -d --name ntechlab -p 5000:5000 cameritegeneric.azurecr.io/ntechlab-mock

# or if you want to change the port on the host for 8956 for example
docker run --rm -d --name ntechlab -p 8956:5000 cameritegeneric.azurecr.io/ntechlab-mock
```

## Install

### Environment Variables

Environment Variables can be set on `.env` file. You `.env.example` as example.

### How to Install?

```bash
nvm use
npm install
```

### How to run?

```bash
nvm use
npm run dev
```

### How to run tests?

```bash
nvm use
npm run test
```
