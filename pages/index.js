import React from "react";
import Container from "../components/html/Container";
import Content from "../components/html/Content";
import Page from "../components/html/Page";
import { BadgeList, RepoBadge } from "../components/widgets/RepoBadge";
import LineChart, { COLOR_ARRAY } from "../components/widgets/LineChart";
import useRepos, { Interval } from "../hooks/useRepos";
import Select from "../components/widgets/Select";
import GithubStats from "../components/widgets/GithubStats";
import Footer from "../components/Footer.mdx";

const Reveal = ({ reveal, children }) => {
  return reveal ? <>{children}</> : <></>;
};

const Wrapper = ({ children }) => (
  <Page>
    <Container>
      <Content>{children}</Content>
    </Container>
  </Page>
);

export default function Index() {
  const [field, setField] = React.useState("commits");
  const { state, actions } = useRepos();
  const { repos, search, interval } = state;

  const onFormSubmit = (e) => {
    e.preventDefault();
    actions.commitSearch();
  };

  const onSearchChange = (event) => {
    actions.updateSearch(event.target.value);
  };

  const onX = (name) => {
    actions.rmRepo(name);
  };

  return (
    <Wrapper>
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
        {Object.keys(repos).map((r, i) => (
          <RepoBadge
            key={r}
            name={r}
            onX={onX}
            isLoading={repos[r].status === "loading"}
            colorIndex={i}
          />
        ))}
      </BadgeList>
      <Reveal reveal={Object.keys(repos).length}>
        <h2 className="content-title font-weight-normal">
          <Select
            id="dataSelect"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            <option value="commits">Commits</option>
            <option value="adds">Line Additions</option>
          </Select>
          over the past
          <Select
            id="windowSelect"
            value={interval}
            onChange={(e) => actions.setInterval(e.target.value)}
          >
            <option value={Interval.ONE_YEARS}>12 months</option>
            <option value={Interval.TWO_YEARS}>2 years</option>
            <option value={Interval.FIVE_YEARS}>5 years</option>
            <option value={Interval.TEN_YEARS}>10 years</option>
          </Select>
        </h2>
        <LineChart repos={repos} labelField="ts" dataField={field} />
        <GithubStats names={Object.keys(repos)} />
        <div className="row">
          <div className="col-6">
            <h2 className="content-title">Related</h2>
            <a>Coming soon!</a>
          </div>
          <div className="col-6">
            <h2 className="content-title">Popular</h2>
            <a>Coming soon!</a>
          </div>
        </div>

        <div style={{ margin: "60px 0" }}>
          <Footer />
        </div>
      </Reveal>
    </Wrapper>
  );
}
