import GuestRoute from "@/components/auth/GuestRoute";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <GuestRoute>
            <LoginForm />
        </GuestRoute>
    );
}
