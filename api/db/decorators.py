from functools import wraps
from typing import List
import flask


def query_parameters(*params: List[str]):
    def _query_parameters(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for param in params:
                if param not in flask.request.args:
                    return flask.Response(
                        f"`{param}` query param is required.", status=400
                    )

            return fn(
                *args,
                *[flask.request.args.get(param) for param in params],
                **kwargs,
            )

        return wrapper

    return _query_parameters
