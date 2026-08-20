import prisma from "../config/database.js";

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export async function findUserById(id) {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
}

export async function createUser(userData) {
    return prisma.user.create({
        data: userData,
    });
}

export async function updateUser(id, data) {
    return prisma.user.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteUser(id) {
    return prisma.user.delete({
        where: {
            id,
        },
    });
}
