import React from "react";

const RepoContext = React.createContext({});

export default RepoContext;
export const { Provider, Consumer } = RepoContext;
