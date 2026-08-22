'use client';

import { useState } from 'react';

import DashboardTopBar from './dashboardTopBar';

import HomeModule from '@/components/modules/home/homeModule';
import ChatLayout from '@/components/layout/chatLayout';

type DashboardSection =
    | 'home'
    | 'messages';

export default function DashboardLayout() {

    const [activeSection, setActiveSection] =
        useState<DashboardSection>('home');

    return (
        <main
            className="
                flex
                h-[100dvh]
                w-full
                flex-col
                overflow-hidden
                bg-[#F7F5FA]
            "
        >

            {/* ================================================= */}
            {/* ALWAYS VISIBLE TOP BAR                            */}
            {/* ================================================= */}

            <DashboardTopBar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />


            {/* ================================================= */}
            {/* DASHBOARD CONTENT                                 */}
            {/* ================================================= */}

            <section className="min-h-0 flex-1 overflow-hidden">

                {activeSection === 'home' && (
                    <HomeModule />
                )}

                {activeSection === 'messages' && (
                    <ChatLayout />
                )}

            </section>

        </main>
    );
}