import { v4 as uuidv4 } from "uuid";

export function requestId(req, res, next) {
    const id = uuidv4();

    req.requestId = id;

    res.setHeader("x-request-id", id);

    next();
}
