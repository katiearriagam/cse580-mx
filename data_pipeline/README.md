# TODO

- [ ] Add the retry for the SQL connection
- [ ] Add a schedule for the machine to start (before the cron job)
https://brave-field-e50109729d744790b24305ce4974e77f.azurewebsites.net/cases

## To recreate the job schedule

```bash
AZURE_TENANT_ID=bcce530a-982f-4aef-89a2-1f890cafd240 AZURE_PIPELINES=true python aml_pipeline.py --cicd true
```