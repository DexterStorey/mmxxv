import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'
import Nav from '~/components/nav'
import { ProbabilityMarketsTable } from '~/components/probability-markets-table'
import { db } from '~/db'

// January 20, 2025 at midnight EST = January 21, 2025 at 05:00 UTC
const PROBABILITIES_START_DATE = new Date('2025-01-21T05:00:00.000Z')

export default async function ProbabilityAssignmentPage() {
	// Redirect if before the start date
	if (new Date() < PROBABILITIES_START_DATE) {
		redirect('/markets')
	}

	const { user } = await getSession()

	const markets = await db.market.findMany({
		include: {
			author: {
				select: {
					id: true,
					email: true,
					username: true
				}
			},
			predictions: {
				select: {
					userId: true,
					probability: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<div className="card-header">
						<h1 className="title" style={{ margin: 0, borderBottom: 'none', fontFamily: 'inherit' }}>
							Market Probabilities
						</h1>
					</div>
					<div className="section-content">
						Current average probabilities for each market based on all user predictions.
					</div>
					<div className="overflow-x-auto">
						<ProbabilityMarketsTable markets={markets} userId={user.id} />
					</div>
				</div>
			</div>
		</>
	)
}
