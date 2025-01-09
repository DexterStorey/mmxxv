import { Stage } from '@prisma/client'
import { getSession } from '~/actions/auth'
import Invite from '~/components/invite'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'
import { db } from '~/db'

export default async () => {
	await getSession()

	const { stage } = await db.settings.findUniqueOrThrow({ where: { id: '0' } })

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<h1 className="title">Welcome to MMXXV</h1>
					<p className="section-content">A prediction game for 2025.</p>
					<div className="section">
						<h2 className="section-title">Current Stage: {stage}</h2>
						{stage === Stage.ACCOUNT_CREATION && (
							<>
								<p className="section-content">Sign up for an account, invite friends.</p>
								<strong className="meta">Ends on January 20, 2025</strong>
								<br />
								<br />
								<Invite />
							</>
						)}
					</div>
					<div className="section">
						<div className="section-title">Recent Markets</div>
						<MarketsTable limit={10} />
					</div>
				</div>
			</div>
		</>
	)
}
