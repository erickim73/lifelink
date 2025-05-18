import { Suspense } from 'react'
import MainChat from './MainChat'

export default function ChatPage() {
	return (
		<div className="h-screen overflow-auto">
			<Suspense fallback={<div>Loading...</div>}>
				<MainChat />
			</Suspense>
		</div>
	)
}
