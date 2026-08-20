"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { login } from "@/services/auth.service";
import { loginSchema } from "@/validations/login.schema";
import { useAuthStore } from "@/store/auth.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values) {
        try {
            setLoading(true);

            const response = await login(values);

            console.log("Login response:", response);

            // Save user in Zustand
            setUser(response.data);

            toast.success(response.message || "Login Successful");

            console.log("Redirecting to dashboard...");

            router.replace("/dashboard");
        } catch (error) {
            console.error(error);

            toast.error(error.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-3xl">
                    Welcome Back
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                        />

                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <p className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
