import os, sys

from azure.keyvault.secrets import SecretClient

sys.path.append(os.path.join(sys.path[0], '../..'))

from config import auto_config as config
from credential import get_credential

default_key_vault = config.KEY_VAULT_URL
credential = get_credential()


def get_secret(secret_name: str, key_vault: str = default_key_vault):
    try:
        secret_client = SecretClient(vault_url=key_vault, credential=credential)
        secret = secret_client.get_secret(secret_name).value

        return secret
    except Exception as e:
        raise e


def set_secret(name: str, secret: str, key_vault: str = default_key_vault):
    try:
        secret_client = SecretClient(vault_url=key_vault, credential=credential)
        secret_client.set_secret(name, secret)
    except Exception as e:
        raise e


# not working
def list_secrets(key_vault: str = default_key_vault):
    try:
        secret_client = SecretClient(vault_url=key_vault, credential=credential)
        secrets = secret_client.list_properties_of_secrets()

        for secret in secrets:
            print(secret.name)
    except Exception as e:
        raise e


def delete_secret(name: str, key_vault: str = default_key_vault):
    secret_client = SecretClient(vault_url=key_vault, credential=credential)
    try:
        poller = secret_client.begin_delete_secret(name)
        deleted_secret = poller.result()
    except:
        print('')
    try:
        secret_client.purge_deleted_secret(name)
        print(f'secret name: {name} deleted!')
    except:
        print('Could not delete! Try again!')
