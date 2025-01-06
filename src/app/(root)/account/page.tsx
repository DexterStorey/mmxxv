import { getSession } from "~/auth/actions";
import Nav from "~/components/nav";
import { db } from "~/db";

export default async function AccountPage() {
    const {user} = await getSession()
        const email = await db.user.findUniqueOrThrow({
            where: {id: user.id},
            select: {email: true}
        })

	return (
		<>
			<Nav />
			<h1>Account</h1>
			<p>Signed in as: {email.email}</p>
		</>
	)
}
