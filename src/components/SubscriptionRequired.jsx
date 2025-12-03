import React from "react";
import { Container, Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";

export default function SubscriptionRequired() {
    const navigate = useNavigate();

    return (
        <Container className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Subscription required</h1>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
                To view or create events, you need an active KR One Pass subscription.
                Your subscription gives you access to courts, venues and community
                activities across Lithuania.
            </p>

            <Button variant="primary" onClick={() => navigate("/subscribe")}>
                Subscribe now
            </Button>
        </Container>
    );
}
