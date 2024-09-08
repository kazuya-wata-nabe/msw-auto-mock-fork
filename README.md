## setup

```sh
mkdir -p .vscode && cp settings.example.json .vscode/settings.json
pnpm install
```

## usage

```sh
pnpm tsx src ${inputfile.yaml} --outdir dist
```