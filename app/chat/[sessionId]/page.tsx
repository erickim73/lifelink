import ChatWrapper from "./ChatWrapper";

type ChatHistoryProps = {
    params: {
        sessionId: string
    }
}

export default async function ChatHistory({params}: ChatHistoryProps) {
    const {sessionId} = params

    return (
        <main className = 'h-screen w-full'>
            <ChatWrapper sessionId={sessionId}/>
        </main>
    )
}

