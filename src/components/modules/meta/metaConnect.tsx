"use client";

import MetaConnectButton from "./MetaConnectButton";

type MetaConnectProps = {
    onConnected?: () => void;
};

export default function MetaConnect({
    onConnected,
}: MetaConnectProps) {
    return (
        <div className="flex min-h-full w-full items-center justify-center bg-[#f5f6f7] p-6">
            <div className="w-full max-w-md rounded-xl border border-[#dadde1] bg-white p-8 shadow-sm">
                {/* Meta logo */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2]">
                        <span className="text-3xl font-bold leading-none text-white">
                            f
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-[24px] font-semibold text-[#1c1e21]">
                        Connect to Meta
                    </h1>

                    <p className="mt-2 text-[15px] leading-6 text-[#65676b]">
                        Connect your Meta account to manage your Facebook and
                        Instagram assets from one place.
                    </p>
                </div>

                <div className="mt-7">
                    <MetaConnectButton
                        onConnected={onConnected}
                    />
                </div>

                <p className="mt-5 text-center text-xs leading-5 text-[#8a8d91]">
                    By connecting your account, you authorize this app to access
                    the Meta assets and permissions you approve.
                </p>
            </div>
        </div>
    );
}