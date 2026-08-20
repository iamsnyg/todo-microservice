"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerSchema } from "@/validations/register.schema";
import { register as registerUser } from "@/services/auth.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(values) {
        try {
            setLoading(true);

            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
            };

            const response = await registerUser(payload);

            toast.success(response.message || "Registration Successful");

            router.push("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-3xl">
                    Create Account
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            placeholder="Enter your name"
                            {...register("name")}
                        />

                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword")}
                        />

                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </Button>

                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
