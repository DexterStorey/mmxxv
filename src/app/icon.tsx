import { ImageResponse } from 'next/og'
import { Favicon } from '~/components/favicon'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { height: 32, width: 32 }

export default async function Icon() {
	return new ImageResponse(<Favicon style={{ background: 'black', color: 'white' }} />, size)
}
