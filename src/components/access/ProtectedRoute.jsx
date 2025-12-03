import React from "react";
import useAuth from "@/hooks/useAuth";
import SubscriptionRequired from "./SubscriptionRequired";

export default function ProtectedRoute({ children }) {
    const { user, sub, loading } = useAuth();

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    // Not logged in → block
    if (!user) return <SubscriptionRequired />;

    // Logged in but no active subscription → block
    if (!sub?.active) return <SubscriptionRequired />;

    return children;
}
