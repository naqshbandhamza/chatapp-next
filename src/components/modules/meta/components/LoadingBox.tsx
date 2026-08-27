export function LoadingBox({ text }: { text: string }) {
    return (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-[#dadde1] bg-white">
            <div className="flex items-center gap-3 text-sm text-[#65676b]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" />

                {text}
            </div>
        </div>
    );
}
