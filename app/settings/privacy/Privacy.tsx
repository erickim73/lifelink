"use client"

import { Shield, Lock, Eye, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const Privacy = () => {
    return (
        <div className="h-full w-full p-6 overflow-y-auto">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <CardTitle>Data Privacy</CardTitle>
                    </div>
                    <CardDescription>Learn how your information is protected when using LifeLink</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-white">LifeLink believes in transparent data practices</p>
                        <p className="text-gray-400">
                            Keeping your data safe is a priority. Learn how your information is protected when using LifeLink
                            products.
                        </p>
                    </div>

                <Separator className="my-6" />

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-blue-500" />
                                <h3 className="text-xl font-medium">How we protect your data</h3>
                            </div>
                            <ul className="space-y-3 pl-9">
                                <li className="list-disc text-gray-300">
                                    By default, LifeLink doesn&apos;t train our generative models on your conversations.
                                </li>
                                <li className="list-disc text-gray-300">LifeLink doesn&apos;t sell your data to third parties.</li>
                                <li className="list-disc text-gray-300">
                                    LifeLink deletes your data promptly when requested, except for safety violations or conversations
                                    you&apos;ve shared through feedback.
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-blue-500" />
                                <h3 className="text-xl font-medium">How we use your data</h3>
                            </div>
                            <ul className="space-y-3 pl-9">
                                <li className="list-disc text-gray-300">
                                    LifeLink may use conversations flagged for safety violations to ensure safety of our systems for all
                                    users.
                                </li>
                                <li className="list-disc text-gray-300">
                                    LifeLink may use your email for account verification, billing, and LifeLink-led communications and
                                    marketing (e.g., emails sharing new product offerings and features).
                                </li>
                                <li className="list-disc text-gray-300">
                                    LifeLink may conduct aggregated, anonymized analysis of data to understand how people use our
                                    services.
                                </li>
                                <li className="list-disc text-gray-300">
                                    LifeLink may offer additional features, which will enable us to collect and use more of your data.
                                    You&apos;ll always be in control and can turn off these features in your account settings.
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 rounded-lg border border-blue-800/30 bg-blue-900/20 p-4">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-300">Privacy Policy</h4>
                                    <p className="text-sm text-blue-200/80 mt-1">
                                        For more detailed information about our data practices, please review our full Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Privacy
