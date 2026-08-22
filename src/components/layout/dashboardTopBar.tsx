'use client';

type DashboardSection =
    | 'home'
    | 'messages';

interface DashboardTopBarProps {
    activeSection: DashboardSection;
    setActiveSection: (
        section: DashboardSection
    ) => void;
}

export default function DashboardTopBar({
    activeSection,
    setActiveSection,
}: DashboardTopBarProps) {

    return (
        <header
            className="
                flex
                h-[10dvh]
                shrink-0
                items-center
                border-b
                border-gray-100
                bg-white
                px-4
                sm:px-6
            "
        >

            {/* LOGO */}

            <div className="mr-8 flex items-center">
                <span
                    className="
                        text-lg
                        font-bold
                        tracking-tight
                        text-[#6C5CE7]
                    "
                >
                    Chime
                </span>
            </div>


            {/* NAVIGATION */}

            <nav className="flex h-full items-center gap-1">

                <button
                    onClick={() =>
                        setActiveSection('home')
                    }
                    className={`
                        h-full
                        border-b-2
                        px-4
                        text-sm
                        font-semibold
                        transition

                        ${
                            activeSection === 'home'
                                ? `
                                    border-[#6C5CE7]
                                    text-[#6C5CE7]
                                  `
                                : `
                                    border-transparent
                                    text-gray-500
                                    hover:text-gray-900
                                  `
                        }
                    `}
                >
                    Home
                </button>


                <button
                    onClick={() =>
                        setActiveSection('messages')
                    }
                    className={`
                        h-full
                        border-b-2
                        px-4
                        text-sm
                        font-semibold
                        transition

                        ${
                            activeSection === 'messages'
                                ? `
                                    border-[#6C5CE7]
                                    text-[#6C5CE7]
                                  `
                                : `
                                    border-transparent
                                    text-gray-500
                                    hover:text-gray-900
                                  `
                        }
                    `}
                >
                    Messages
                </button>

            </nav>


            {/* RIGHT SIDE */}

            <div className="ml-auto flex items-center gap-3">

                {/* Add notifications/profile/etc later */}

                <button
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F0EDFF]
                        text-sm
                        font-bold
                        text-[#6C5CE7]
                    "
                >
                    U
                </button>

            </div>

        </header>
    );
}