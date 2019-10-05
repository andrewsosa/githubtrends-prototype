import os
import signal
from subprocess import PIPE, STDOUT, Popen
from typing import Dict, Optional

from airflow.plugins_manager import AirflowPlugin
from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.utils.operator_helpers import context_to_airflow_vars


class ShellOperator(BaseOperator):

    template_fields = ("bash_command", "env")
    template_ext = (".sh", ".bash")
    ui_color = "#f0ede4"

    @apply_defaults
    def __init__(
        self,
        bash_command: str,
        env: Optional[Dict[str, str]] = None,
        output_encoding: str = "utf-8",
        *args,
        **kwargs
    ) -> None:

        super().__init__(*args, **kwargs)
        self.bash_command = bash_command
        self.env = env
        self.output_encoding = output_encoding
        if kwargs.get("xcom_push") is not None:
            raise AirflowException(
                "'xcom_push' was deprecated, use 'BaseOperator.do_xcom_push' instead"
            )

    def execute(self, context):
        """
        Execute the bash command in a temporary directory
        which will be cleaned afterwards
        """

        # Prepare env for child process.
        env = self.env
        if env is None:
            env = os.environ.copy()

        airflow_context_vars = context_to_airflow_vars(context, in_env_var_format=True)
        self.log.info(
            "Exporting the following env vars:\n%s",
            "\n".join(["{}={}".format(k, v) for k, v in airflow_context_vars.items()]),
        )
        env.update(airflow_context_vars)

        self.lineage_data = self.bash_command

        self.log.info("Running command: %s", self.bash_command)
        sub_process = Popen(
            [self.bash_command],
            stdout=PIPE,
            stderr=STDOUT,
            # cwd=tmp_dir,
            shell=True,
            env=env,
        )

        self.sub_process = sub_process

        self.log.info("Output:")
        line = ""
        for raw_line in iter(sub_process.stdout.readline, b""):
            line = raw_line.decode(self.output_encoding).rstrip()
            self.log.info(line)

        sub_process.wait()

        self.log.info("Command exited with return code %s", sub_process.returncode)

        if sub_process.returncode:
            raise AirflowException("Bash command failed")

        return line

    def on_kill(self):
        self.log.info("Sending SIGTERM signal to bash process group")
        os.killpg(os.getpgid(self.sub_process.pid), signal.SIGTERM)


class ShellOperatorPlugin(AirflowPlugin):
    name = "shell_operator_plugin"
    operators = [ShellOperator]
