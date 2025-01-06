import { notFound } from "next/navigation";
import Nav from "~/components/nav";
import { db } from "~/db";
import { MarketVotes } from "~/components/market-votes";
import { MarketComments } from "~/components/market-comments";
import styles from "./page.module.css";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function MarketPage({ params }: PageProps) {
    const { id } = await params;
    const market = await db.market.findUnique({
        where: { id},
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

    if (!market) {
        notFound();
    }

    return (
        <>
            <Nav />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>{market.title}</h1>
                    <div className={styles.author}>
                        Created by {market.author.email}
                    </div>
                    
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Description</h2>
                        <p className={styles.sectionContent}>{market.description}</p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Resolution Criteria</h2>
                        <p className={styles.sectionContent}>{market.resolutionCriteria}</p>
                    </div>

                    <MarketVotes market={market} />
                    <MarketComments market={market} />
                </div>
            </div>
        </>
    );
} 