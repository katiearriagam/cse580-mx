To redeploy changes run this in your terminal:

```bash
az webapp up --runtime PYTHON:3.10 --sku B1 --resource-group cse580 --name brave-field-e50109729d744790b24305ce4974e77f  --logs
```

NOTICE:

When you ssh into the machine

```bash
ssh -p50000 azureuser@13.93.152.144
```

you immediately run

```bash
zsh
```