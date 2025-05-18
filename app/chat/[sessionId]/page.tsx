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
        <main className="w-full h-screen">
            <ChatWrapper sessionId={sessionId}/>
        </main>
    )
}