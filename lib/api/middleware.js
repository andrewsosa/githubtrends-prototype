import morgan from "micro-morgan";
import get from "micro-get";
import { handleErrors, createError } from "micro-boom";
import qs from "./querystring";

export default function middleware(handler) {
  return morgan("dev")(get(handleErrors(handler, true)));
}

export function validate(schema) {
  return handler => {
    return async (req, res) => {
      const query = qs(req);
      try {
        await schema.validateAsync(query);
        return handler(req, res);
      } catch (e) {
        throw createError(400, "Incomplete request", {
          reason: "Please provide repo and start",
        });
      }
    };
  };
}
