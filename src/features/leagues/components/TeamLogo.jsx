export default function TeamLogo({ initials, color }) {
    return (
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: color || "#1E88E5" }}
        >
            {initials?.toUpperCase() || "?"}
        </div>
    );
}
