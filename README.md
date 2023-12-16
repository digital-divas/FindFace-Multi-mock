# FindFace Multi mock

This is a non-official mock to the Find Face API.

The implementation is based on [this documentation](https://docs.ntechlab.com/projects/ffmulti/en/2.1/api.html).

## How to run?

```bash
docker run --rm -d --name ntechlab -p 5000:5000 ezequielmr94/findface-multi-mock

# or if you want to change the port on the host for 8956 for example
docker run --rm -d --name ntechlab -p 8956:5000 ezequielmr94/findface-multi-mock
```

## Install

### How to Install?

```bash
nvm use
npm install
```

### How to run dev?

```bash
nvm use
npm run dev
```

### How to run tests?

```bash
nvm use
npm run test
```

### How to deploy

```bash
kubectl apply -f kube/deployment -n <your_desired_namespace>
```
