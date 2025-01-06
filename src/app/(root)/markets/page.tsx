import Nav from "~/components/nav";
import { db } from "~/db";
import { MarketItem } from "~/components/market-item";
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
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Markets</h1>
                    <CreateMarketForm />
                </div>
                <div className="space-y-4">
                    {markets.map(market => (
                        <MarketItem key={market.id} market={market} />
                    ))}
                </div>
            </div>
        </>
    );
}