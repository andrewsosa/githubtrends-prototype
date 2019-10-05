FROM python:3.6
RUN pip install dask distributed
CMD ["dask-scheduler"]
