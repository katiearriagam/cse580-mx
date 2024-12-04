import argparse
import logging
import os
import sys
from datetime import datetime

from azure.ai.ml import MLClient, Output, command, dsl
from azure.ai.ml.constants import TimeZone
from azure.ai.ml.entities import (
    CronTrigger,
    Environment,
    JobSchedule,
)
from azureml.core.conda_dependencies import CondaDependencies


# from azureml.core.conda_dependencies import CondaDependencies

sys.path.append(os.path.join(sys.path[0], ".."))
sys.path.append(os.path.join(sys.path[0], "../.."))

from config import auto_config as config
from credential import get_credential

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s: %(message)s")
logger = logging.getLogger("cse580-amlpipeline")
logger.setLevel(logging.INFO)

dir_path = os.path.dirname(os.path.realpath(__file__))

credential = get_credential()

# Parse arguments passed from CI/CD
parser = argparse.ArgumentParser()
parser.add_argument("--cicd")

args = parser.parse_args()
# environment = os.environ['ENVIRONMENT']
# run_environment = environment if environment else 'STAGING'
ci_cd = True if args.cicd == "true" else False
# python aml_pipeline.py --cicd


ml_client = MLClient(
    credential=credential,
    subscription_id=config.AZUREML_SUBSCRIPTION_ID,
    resource_group_name=config.AZUREML_RESOURCE_GROUP,
    workspace_name=config.AZUREML_WORKSPACE_NAME,
)
# TODO: probably move to config
compute_env_name = "uifanalysis"
compute_name = "katiearriaga1"


@dsl.pipeline(description="cse580-pipeline")
def cse580_pipeline():
    command_job = command(
        code=".",  # this will be automatically uploaded to the machine when the job runs
        command="python process_data.py",
        environment=f"{compute_env_name}@latest",
        environment_variables={
            "ENVIRONMENT": "PRODUCTION",
        },
        compute=compute_name,
        display_name="process_data",
        outputs={"output_data": Output(type="uri_folder", mode="direct")},
        is_deterministic=False,
    )
    pjob = command_job()

    return {"pipeline_job_output_data": pjob.outputs.output_data}


def create_environment():
    logger.info("Creating Environment")
    requirements_path = os.path.join(dir_path, "./requirements.txt")

    with open(requirements_path, "r", encoding="utf-8") as f:
        required = f.read().splitlines()
    packages = CondaDependencies.create(
        python_version=config.PYTHON_VERSION, pip_packages=required
    )

    save_path = os.path.join(dir_path, "./ci_cd_environment.yaml")
    packages.save(save_path)
    aml_environment = Environment(
        name=compute_env_name,
        conda_file=save_path,
        image=config.ENV_IMAGE,
    )
    ml_client.environments.create_or_update(aml_environment)


def main():
    """
    If running in ADO pipelines will schedule 1 hour after the UIF pipeline
    (because we need the data produced by that one, and it takes a bit long).
    """
    logger.info("Start cse580-pipeline")
    create_environment()

    # Create pipeline
    logger.info("Creating pipeline")
    pipeline_job = cse580_pipeline()

    # Only schedule if running in the ADO pipelines
    if ci_cd:
        schedule_name = "cse580-pipeline_schedule"
        cron_exp = "0 19 * * *"  # 7PM UTC = 12PM PDT = 11AM PST - 2 hours after UIF
        schedule_start_time = datetime.now()
        cron_trigger = CronTrigger(
            expression=cron_exp,
            start_time=schedule_start_time,  # start time
            time_zone=TimeZone.UTC,  # time zone of expression
        )

        job_schedule = JobSchedule(
            name=schedule_name, trigger=cron_trigger, create_job=pipeline_job
        )

        job_schedule = ml_client.schedules.begin_create_or_update(
            schedule=job_schedule
        ).result()
    else:
        # Run the pipeline
        pipeline_result = ml_client.jobs.create_or_update(
            pipeline_job,
            experiment_name="cse580-pipeline_job",
        )
        # Stream the logs into stdout
        ml_client.jobs.stream(pipeline_result.name)

    logger.info("Done")


if __name__ == "__main__":
    main()
