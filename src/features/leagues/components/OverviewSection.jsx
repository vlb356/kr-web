import { useOutletContext } from "react-router-dom";

export default function OverviewSection() {
    const { league, user } = useOutletContext();

    if (!league) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>

            <div className="p-4 border rounded-lg">
                <p><strong>Owner:</strong> {league.ownerUid}</p>
                <p><strong>Visibility:</strong> {league.visibility}</p>
                <p><strong>Created:</strong> {league.createdAt?.toDate?.().toLocaleString()}</p>
            </div>
        </div>
    );
}
