#!/usr/bin/env python

from argparse import ArgumentParser
from os import path
from sys import argv, stdout

parser = ArgumentParser()
parser.add_argument("ds")
args = parser.parse_args()
ds = args.ds


with open(path.join(path.dirname(__file__), "../sql/popular-repos.sql")) as f:
    query = f.read().format(ds=ds)
    stdout.write(query)
