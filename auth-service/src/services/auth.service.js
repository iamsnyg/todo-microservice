import {
    createUser,
    findUserByEmail,
} from "../repositories/user.repository.js";

import { comparePassword, hashPassword } from "./password.service.js";

import { publishUserRegistered } from "./rabbitmq.service.js";

import {
    createSession,
    destroySession,
    getSessionUser,
} from "./session.service.js";

function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}

export async function register(data) {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await createUser({
        ...data,
        password: hashedPassword,
    });

    await publishUserRegistered({
        name: user.name,
        email: user.email,
    });

    return sanitizeUser(user);
}

export async function login(req, data) {
    const user = await findUserByEmail(data.email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const match = await comparePassword(data.password, user.password);

    if (!match) {
        throw new Error("Invalid credentials");
    }

    await createSession(req, user);

    return sanitizeUser(user);
}

export async function logout(req) {
    await destroySession(req);
}

export function getCurrentUser(req) {
    return getSessionUser(req);
}
