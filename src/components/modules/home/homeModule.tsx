'use client';

export default function HomeModule() {
    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* HOME SIDEBAR */}
            <aside
                className="
                    hidden
                    w-[260px]
                    shrink-0
                    flex-col
                    border-r
                    border-gray-100
                    bg-white
                    lg:flex
                "
            >
                <div className="border-b border-gray-100 px-5 py-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        Dashboard
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Welcome back
                    </p>
                </div>

                <nav className="flex flex-1 flex-col gap-1 p-3">

                    <button
                        className="
                            flex items-center gap-3
                            rounded-xl
                            bg-[#F0EDFF]
                            px-4 py-3
                            text-sm font-semibold
                            text-[#6C5CE7]
                        "
                    >
                        <span>⌂</span>
                        Overview
                    </button>

                    <button
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-4 py-3
                            text-sm
                            text-gray-500
                            transition
                            hover:bg-gray-50
                            hover:text-gray-900
                        "
                    >
                        <span>📊</span>
                        Activity
                    </button>

                    <button
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-4 py-3
                            text-sm
                            text-gray-500
                            transition
                            hover:bg-gray-50
                            hover:text-gray-900
                        "
                    >
                        <span>👥</span>
                        Users
                    </button>

                    <button
                        className="
                            flex items-center gap-3
                            rounded-xl
                            px-4 py-3
                            text-sm
                            text-gray-500
                            transition
                            hover:bg-gray-50
                            hover:text-gray-900
                        "
                    >
                        <span>⚙</span>
                        Settings
                    </button>

                </nav>
            </aside>


            {/* HOME MAIN AREA */}
            <main
                className="
                    min-w-0
                    flex-1
                    overflow-y-auto
                    p-4
                    sm:p-6
                    lg:p-8
                "
            >

                <div className="mx-auto w-full max-w-7xl">

                    {/* HEADER */}
                    <div className="mb-6">

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-gray-900
                                sm:text-3xl
                            "
                        >
                            Welcome back 👋
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Here's what's happening with your account.
                        </p>

                    </div>


                    {/* STATS */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        <StatCard
                            title="Total Messages"
                            value="1,284"
                            description="+12% this week"
                            icon="💬"
                        />

                        <StatCard
                            title="Active Chats"
                            value="24"
                            description="+4 this week"
                            icon="👥"
                        />

                        <StatCard
                            title="Online Users"
                            value="18"
                            description="Currently online"
                            icon="🟢"
                        />

                        <StatCard
                            title="Activity"
                            value="86%"
                            description="+8% this month"
                            icon="📈"
                        />

                    </div>


                    {/* CONTENT GRID */}
                    <div
                        className="
                            mt-6
                            grid
                            grid-cols-1
                            gap-6
                            xl:grid-cols-3
                        "
                    >

                        {/* ACTIVITY */}
                        <div
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-5
                                xl:col-span-2
                            "
                        >

                            <div className="mb-5 flex items-center justify-between">

                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Recent Activity
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Your latest activity
                                    </p>
                                </div>

                                <button
                                    className="
                                        text-xs
                                        font-semibold
                                        text-[#6C5CE7]
                                        hover:underline
                                    "
                                >
                                    View all
                                </button>

                            </div>


                            <div className="space-y-4">

                                <ActivityItem
                                    icon="💬"
                                    title="New message"
                                    description="John sent you a message"
                                    time="2 min ago"
                                />

                                <ActivityItem
                                    icon="👤"
                                    title="New user"
                                    description="Sarah joined your network"
                                    time="15 min ago"
                                />

                                <ActivityItem
                                    icon="✓"
                                    title="Conversation completed"
                                    description="Your conversation with Mike ended"
                                    time="1 hour ago"
                                />

                                <ActivityItem
                                    icon="📊"
                                    title="Weekly report"
                                    description="Your weekly activity report is ready"
                                    time="3 hours ago"
                                />

                            </div>

                        </div>


                        {/* QUICK ACTIONS */}
                        <div
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-5
                            "
                        >

                            <h2 className="font-bold text-gray-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Frequently used actions
                            </p>


                            <div className="mt-5 space-y-2">

                                <QuickAction
                                    icon="💬"
                                    title="New Message"
                                />

                                <QuickAction
                                    icon="👤"
                                    title="Add User"
                                />

                                <QuickAction
                                    icon="📊"
                                    title="View Analytics"
                                />

                                <QuickAction
                                    icon="⚙"
                                    title="Account Settings"
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}


/* ========================================================= */
/* STAT CARD                                                 */
/* ========================================================= */

function StatCard({
    title,
    value,
    description,
    icon,
}: {
    title: string;
    value: string;
    description: string;
    icon: string;
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
            "
        >
            <div className="flex items-start justify-between">

                <div>
                    <p className="text-xs font-medium text-gray-400">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {description}
                    </p>
                </div>

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#F0EDFF]
                    "
                >
                    {icon}
                </div>

            </div>
        </div>
    );
}


/* ========================================================= */
/* ACTIVITY ITEM                                             */
/* ========================================================= */

function ActivityItem({
    icon,
    title,
    description,
    time,
}: {
    icon: string;
    title: string;
    description: string;
    time: string;
}) {
    return (
        <div className="flex items-center gap-3">

            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F7F5FA]
                    text-sm
                "
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">

                <p className="text-sm font-semibold text-gray-800">
                    {title}
                </p>

                <p className="truncate text-xs text-gray-400">
                    {description}
                </p>

            </div>

            <span className="shrink-0 text-[11px] text-gray-400">
                {time}
            </span>

        </div>
    );
}


/* ========================================================= */
/* QUICK ACTION                                              */
/* ========================================================= */

function QuickAction({
    icon,
    title,
}: {
    icon: string;
    title: string;
}) {
    return (
        <button
            className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-gray-100
                px-4
                py-3
                text-left
                transition
                hover:border-purple-100
                hover:bg-[#F9F8FF]
            "
        >

            <span
                className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#F0EDFF]
                "
            >
                {icon}
            </span>

            <span className="text-sm font-medium text-gray-700">
                {title}
            </span>

        </button>
    );
}