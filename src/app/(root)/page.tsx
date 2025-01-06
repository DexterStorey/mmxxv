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
			<h1>Welcome to MMXIV, a prediction game for 2025.</h1>
			<p>Current stage: {stage}</p>
			{
				stage === Stage.ACCOUNT_CREATION && (
					<>
						<p>Sign up for an account, invite friends.</p>
						<strong>Ends on January 20, 2025.</strong>
						<br />
						<Invite />
					</>
				)
			}
		</>
	)
}
