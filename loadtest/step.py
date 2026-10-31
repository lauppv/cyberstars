"""Load in steps, for finding where the box stops keeping up: STEP_USERS more
users every STEP_SECONDS, up to MAX_USERS, then it stops. The step where p95
or the errors climb is the limit. run.sh adds this file when STEP=1."""

import os

from locust import LoadTestShape


class StepLoad(LoadTestShape):
    step_users = int(os.environ.get("STEP_USERS") or 2)
    step_seconds = int(os.environ.get("STEP_SECONDS") or 60)
    max_users = int(os.environ.get("MAX_USERS") or 20)

    def tick(self):
        users = (int(self.get_run_time() // self.step_seconds) + 1) * self.step_users
        if users > self.max_users:
            return None
        return users, self.step_users
