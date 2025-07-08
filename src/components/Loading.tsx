import React from "react";

const Loading = (props: { content: string }) => {
    return (
        <div className="min-h-screen bg-white/50 flex items-center justify-center fixed w-full z-[100]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading { props.content }...</p>
            </div>
        </div>
    )
}

export default Loading