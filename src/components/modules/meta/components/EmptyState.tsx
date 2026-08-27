export function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-[#d5d7da] bg-white">
            <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f6f7] text-[#8a8d91]">
                    —
                </div>

                <p className="mt-3 text-sm text-[#65676b]">{text}</p>
            </div>
        </div>
    );
}
