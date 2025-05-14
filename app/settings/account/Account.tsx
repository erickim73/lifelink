import React from 'react'
import { SettingsAccount } from '../../lib/types';
import { CreditCard, LogOut, Mail, User, Settings } from 'lucide-react';
import { supabase } from '@/app/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { Switch } from '@radix-ui/react-switch';


const Account = ({notifications, setNotifications}: SettingsAccount) => {
    const router = useRouter()
    

    const logout = async () => {
        await supabase.auth.signOut();
        console.log("Logged out")
        router.push('/')
    }

    return (
        <div className="h-full w-full p-6 overflow-y-auto">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        <CardTitle>Account Settings</CardTitle>
                    </div>
                    <CardDescription>Manage your account preferences and settings</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-500" />
                            <h3 className="text-xl font-medium">Email & Communication</h3>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">
                                        Email Address
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        example@email.com
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Change
                                </Button>
                            </div>
                            <Separator className="my-2" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">
                                        Notifications
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Receive updates and alerts
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                            <h3 className="text-xl font-medium">Subscription & Billing</h3>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Current Plan</div>
                                    <div className="text-sm text-gray-400">Free Plan</div>
                                </div>
                                <Button variant="outline" size="sm" className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10">
                                    Upgrade
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-blue-500" />
                            <h3 className="text-xl font-medium">Account Actions</h3>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-4">
                            <Button variant="destructive" onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Account
