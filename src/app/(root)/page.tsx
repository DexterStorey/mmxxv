import { Stage } from "@prisma/client"
import Invite from "~/components/invite"
import Nav from "~/components/nav"
import { db } from "~/db"

export default async () => {
	const {stage} = await db.settings.findUniqueOrThrow({
		where: {
			id: "0"
		}
	})
	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<h1 className="title">Welcome to MMXIV</h1>
					<p className="section-content">A prediction game for 2025.</p>
					<div className="section">
						<h2 className="section-title">Current Stage: {stage}</h2>
						{stage === Stage.ACCOUNT_CREATION && (
							<>
								<p className="section-content">Sign up for an account, invite friends.</p>
								<strong className="meta">Ends on January 20, 2025</strong>
								<div className="section">
									<Invite />
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
