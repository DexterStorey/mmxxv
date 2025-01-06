import Nav from "~/components/nav"
import { db } from "~/db"

export default async function LeaderboardPage() {
    const users = await db.user.findMany({
        orderBy: {
            points: 'desc'
        }
    })
    return (
        <>
            <Nav />
            <div className="container">
                <div className="card">
                    <h1 className="title">Leaderboard</h1>
                    <div className="section">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>User</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.email}</td>
                                        <td>{user.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}