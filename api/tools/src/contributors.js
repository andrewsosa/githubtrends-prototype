// @flow

import type { Dataset } from "./types";
import { aggregateTimeSeries, mergeTimeSeries } from "./aggregate";

type UnixTimeStamp = string;

type Author = {
  login: string,
};

type Contributor = {
  total: number,
  weeks: Array<{
    w: UnixTimeStamp,
    a: number,
    d: number,
    c: number,
  }>,
  author: Author,
};

type GithubStats = Array<Contributor>;

type Metadata = { [string]: any };

export function takeTopContributors(
  data: Contributor[],
  n: number = 10
): Contributor[] {
  return data
    .slice()
    .sort((a: Contributor, b: Contributor) => b.total - a.total)
    .slice(0, n);
}

export function extractWeekLabels(data: GithubStats): Date[] {
  const contrib: Contributor = data[0];
  return contrib.weeks.map(week => new Date(Number(week.w) * 1000));
}

export function parseContributorDataset(contributor: Contributor): Dataset {
  return {
    label: contributor.author.login,
    fill: false,
    data: contributor.weeks.map(week => ({
      x: new Date(Number(week.w) * 1000),
      y: week.a + week.d,
    })),
  };
}

export function aggregateUserContributions(dataset: Dataset): Dataset {
  return {
    ...dataset,
    data: aggregateTimeSeries(dataset.data),
  };
}

export function mergeContributions(
  datasets: Dataset[],
  { label, ...rest }: Metadata
): Dataset {
  return {
    label,
    ...rest,
    data: mergeTimeSeries(datasets.map(set => set.data)),
  };
}

/**
 * Take a Github contributor response and:
 * 1. Parse each contributor dataset
 * 2. Round the user contriutions per month
 * 3. Merge the user contributions into a single dataset.
 */
export function aggregateRepoActivity(
  stats: GithubStats,
  { label, ...rest }: Metadata
): Dataset {
  return mergeContributions(
    stats.map(parseContributorDataset).map(aggregateUserContributions),
    { label, ...rest }
  );
}
