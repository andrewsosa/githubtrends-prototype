import React from "react";
import Container from "../components/html/Container";
import Content from "../components/html/Content";
import Page from "../components/html/Page";
import { BadgeList, RepoBadge } from "../components/widgets/RepoBadge";

import CommitService from "../services/CommitService";
import LineChart from "../components/widgets/LineChart";
import useRepos from "../hooks/useRepos";

// const Commits = new CommitService();

export default function Index() {
  // const [state, setState] = React.useState({
  //   search: "",
  //   repos: {},
  // });

  const { state, actions } = useRepos();

  const { repos, search } = state;

  // const onCommitsReceived = ({ repo, commits, status }) => {
  //   if (status !== 200) {
  //     console.log("whoops");
  //     return;
  //   }
  //   setState((s) => {
  //     return {
  //       ...s,
  //       repos: { ...s.repos, [repo]: { status: "complete", data: commits } },
  //     };
  //   });
  // };

  const onFormSubmit = (e) => {
    e.preventDefault();
    actions.commitSearch();
    // setState((s) => {
    //   Commits.pull(s.search).then(onCommitsReceived);
    //   return {
    //     ...s,
    //     search: "",
    //     repos: { ...s.repos, [s.search]: { status: "loading", data: null } },
    //   };
    // });
  };

  const onSearchChange = (event) => {
    actions.updateSearch(event.target.value);
    // setState((s) => ({ ...s, search: value }));
  };

  const onX = (name) => {
    actions.rmRepo(name);
    // setState((s) => {
    //   const newRepos = {
    //     ...s.repos,
    //   };

    //   delete newRepos[name];

    //   return {
    //     ...s,
    //     repos: newRepos,
    //   };
    // });
  };

  return (
    <Page>
      <Container>
        <Content>
          <h2>
            {repos.length
              ? repos.join(" vs ")
              : "Compare repository activity over time"}
          </h2>
          <form onSubmit={onFormSubmit}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search Github repos..."
              onChange={onSearchChange}
              value={search}
              style={{
                border: "2px solid lightgray",
              }}
            />
          </form>
          <BadgeList>
            {Object.keys(repos).map((r) => (
              <RepoBadge
                key={r}
                name={r}
                onX={onX}
                isLoading={repos[r].status === "loading"}
              />
            ))}
          </BadgeList>
          {Object.keys(repos).length ? (
            <LineChart repos={repos} labelField="ts" dataField="commits" />
          ) : (
            <div />
          )}
        </Content>
      </Container>
    </Page>
  );
}
