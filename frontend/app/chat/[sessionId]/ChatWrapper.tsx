'use client'

import {useParams} from 'next/navigation'
import ChatDetail from './client'

export default function ChatWrapper({sessionId}: {sessionId: string}) {
    const params = useParams()
    const finalSessionId = sessionId || (params?.sessionId as string)

    if (!finalSessionId) {
        return (
            <div>
                Error: No Sesssion ID Found
            </div>
        )
    }

    return <ChatDetail sessionId={finalSessionId} />
}