export function createSession(req, user) {
    return new Promise((resolve, reject) => {
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        req.session.save((err) => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

export function destroySession(req) {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

export function getSessionUser(req) {
    return req.session.user || null;
}
