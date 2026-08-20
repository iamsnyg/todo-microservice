export function requestLogger(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        console.log(`
=========================================
Request ID : ${req.requestId}
Method     : ${req.method}
URL        : ${req.originalUrl}
Status     : ${res.statusCode}
Duration   : ${duration} ms
=========================================
`);
    });

    next();
}
