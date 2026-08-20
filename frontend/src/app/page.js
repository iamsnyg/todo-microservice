import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold">Todo Microservices</h1>

            <div className="flex gap-4">
                <Link
                    href="/login"
                    className="rounded bg-blue-600 px-5 py-2 text-white"
                >
                    Login
                </Link>

                <Link
                    href="/register"
                    className="rounded bg-green-600 px-5 py-2 text-white"
                >
                    Register
                </Link>
            </div>
        </main>
    );
}
