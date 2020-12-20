/* eslint-disable import/prefer-default-export */
import nc from "next-connect";

export const queryParams = (params) => (req, res, next) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const param of params.values(params)) {
    if (!(param in req.query)) {
      return res.status(400).json({ err: `Missing query param '${param}'` });
    }
  }
  next();
};

export const route = () =>
  nc({
    onError: (err, req, res) => {
      console.error(err);
      res.status(500).end(err.toString());
    },
  });
