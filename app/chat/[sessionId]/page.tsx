import ChatWrapper from "./ChatWrapper";

type ChatHistoryProps = {
    params: {
        sessionId: string
    }
}

export default async function ChatHistory(props: ChatHistoryProps) {
    const sessionId = props.params.sessionId

    return (
        <main className = 'h-screen w-full'>
            <ChatWrapper sessionId={sessionId}/>
        </main>
    )
}

