
import ChatWrapper from "./ChatWrapper";

type ChatHistoryProps = {
    params: Promise<{
        sessionId: string
    }>
}

export default async function ChatHistory({ params }: ChatHistoryProps) {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;

    return (
        <main className="h-screen w-full">
            <ChatWrapper sessionId={sessionId}/>
        </main>
    )
}