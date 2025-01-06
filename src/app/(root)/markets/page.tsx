import Nav from "~/components/nav";
import { db } from "~/db";
import Link from "next/link";
import { CreateMarketForm } from "~/components/create-market-form";

export default async function MarketsPage() {
    const markets = await db.market.findMany({
        include: {
            author: {
                select: { email: true }
            },
            upvoters: {
                select: { userId: true }
            },
            downvoters: {
                select: { userId: true }
            },
            comments: {
                include: {
                    author: {
                        select: { email: true }
                    }
                }
            }
        }
    });

    return (
        <>
            <Nav />
            <div className="container">
                <div className="card">
                    <div className="section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1 className="title" style={{ margin: 0 }}>Markets</h1>
                            <CreateMarketForm />
                        </div>
                    </div>
                    <div className="section">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Author</th>
                                    <th>Votes</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {markets.map(market => (
                                    <tr key={market.id}>
                                        <td>
                                            <Link 
                                                href={`/markets/${market.id}`} 
                                                className="nav-link"
                                                style={{ textDecoration: 'underline' }}
                                            >
                                                {market.title}
                                            </Link>
                                        </td>
                                        <td>{market.description}</td>
                                        <td>{market.author.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                                <span>↑{market.upvotes}</span>
                                                <span>↓{market.downvotes}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {market.comments.length}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}