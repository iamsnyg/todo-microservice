export function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    req.user = req.session.user;

    next();
}
