import { send } from "micro";
import qs from "../lib/api/querystring";

export default function handler(request, response) {
  send(response, 200, qs(request));
}
