import { useOutletContext } from "react-router-dom";

export default function StandingsSection() {
    const { leagueId, league, user } = useOutletContext();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Standings</h2>
            <p>Standings for <b>{league.name}</b></p>
        </div>
    );
}
