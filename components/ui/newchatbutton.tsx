import { Plus } from "lucide-react";
import Link from "next/link";  


export default function NewChatButton() {
    return (
        <div className="mb-6">
        <Link href="/chat" className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1A4B84] text-white hover:bg-[#15407A] transition-colors">
            <div className="flex items-center justify-center">
                <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">New chat</span>
        </Link>
        </div>
    );
}