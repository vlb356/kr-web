import { useOutletContext } from "react-router-dom";

export default function MatchesSection() {
    const { leagueId, league, user } = useOutletContext();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Matches</h2>
            <p>Showing matches for league <b>{league.name}</b></p>
        </div>
    );
}
