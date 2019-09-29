import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import SelectContext from "./select/context";

export default withRouter(function UrlManager({ match, location, history }) {
  const [{ packages }] = useContext(SelectContext);

  const route = [...packages].join("-vs-");

  useEffect(() => {
    history.push(`/${route}`);
  }, [route]);

  return <></>;
});
