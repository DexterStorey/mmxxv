export function MagicLinkEmailTemplate({ magicLink }: { magicLink: string }) {
	return (
		<div>
			Welcome to MMXXV. Use this link to log in:
			<a href={magicLink}>Log in</a>
		</div>
	)
}
