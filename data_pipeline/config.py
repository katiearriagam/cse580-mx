import os


class Config:
    MANAGED_IDENTITY_CLIENT_ID = "eb0a063e-0a6b-405f-ad60-c054cfdfee09"
    AZUREML_SUBSCRIPTION_ID = "8378cdae-99bb-4974-9dbb-749522a1de76"
    AZUREML_RESOURCE_GROUP = "cse580"
    AZUREML_WORKSPACE_NAME = "cse580-aml"

    # Open AI
    OPEN_AI_API_BASE = "https://cse580-cae-oai.openai.azure.com/"
    OPEN_AI_DEPLOYMENT_NAME = "gpt-4o-mini"
    OPEN_AI_API_VERSION = "2024-02-15-preview"

    # KV
    KEY_VAULT_URL = "https://cse580aml8823189492.vault.azure.net/"
    ENV_IMAGE = "mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest"
    PYTHON_VERSION = "3.12.7"


auto_config = Config
# from config.production import Production
# from config.staging import Staging

env = os.getenv("ENVIRONMENT", None)

if env is None:
    os.environ["ENVIRONMENT"] = "STAGING"
    env = os.getenv("ENVIRONMENT", None)

# if env == 'STAGING':
#     auto_config = Staging
# elif env == 'PRODUCTION':
#     auto_config = Production
# else:
#     os.environ.pop('ENVIRONMENT')
#     raise ValueError(f'ENVIRONMENT is unexpected value: {env}')
