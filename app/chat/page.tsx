import { Suspense } from 'react'
import MainChat from './mainchat'

export default function ChatPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<MainChat />
		</Suspense>
	)
}
