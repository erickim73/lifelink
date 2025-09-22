import React from 'react'
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import SignUp from './signup-form'

const Page = () => {
    return (
        <div className="w-full min-h-screen">
            <BackgroundBeamsWithCollision className="h-full min-h-screen">
                <div className="relative z-10 flex items-center justify-center w-full max-w-md min-h-screen px-4 py-8 mx-auto">
                    <SignUp />
                </div>
            </BackgroundBeamsWithCollision>
        </div>
    )
}

export default Page
