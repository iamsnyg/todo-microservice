export function errorHandler(err, req, res, next) {
    if (err.timeout) {
        return res.status(408).json({
            success: false,
            message: "Request Timeout",
        });
    }

    console.error(err);

    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}
