FROM python:3.6
RUN pip install dask distributed
CMD ["sh", "-c", "dask-worker $DASK_HOST:$DASK_PORT"]
