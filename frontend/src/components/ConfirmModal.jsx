import { useEffect } from "react";

export default function ConfirmModal({
    isOpen,
    title,  
    message,
    confirmText = "Confirm",
    isDestructive = true,
    isLoading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event) {
            if (event.key === "Escape" && !isLoading) {
                onCancel();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isLoading) {
                    onCancel();
                }
            }}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-message"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                            isDestructive
                                ? "bg-red-100 text-red-600"
                                : "bg-indigo-100 text-indigo-600"
                        }`}
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3m0 4h.01M10.3 3.9 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2
                            id="confirm-modal-title"
                            className="text-lg font-semibold text-slate-900"
                        >
                            {title}
                        </h2>

                        <p
                            id="confirm-modal-message"
                            className="mt-2 text-sm leading-6 text-slate-600"
                        >
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isDestructive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {isLoading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </section>
        </div>
    );
}
