import logging
import os
import sys

from azure.identity import AzureCliCredential, ManagedIdentityCredential

sys.path.append(os.path.join(sys.path[0], '../..'))
from config import auto_config as config

is_pipelines = os.environ.get('AZURE_PIPELINES', None) == 'true'


def get_credential():
    tenant_id = os.environ.get('AZURE_TENANT_ID', None)

    if is_pipelines and tenant_id:
        return AzureCliCredential(tenant_id=tenant_id)

    return ManagedIdentityCredential(logging_enable=True, client_id=config.MANAGED_IDENTITY_CLIENT_ID)
