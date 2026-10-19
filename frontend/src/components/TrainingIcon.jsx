function TrainingIcon({ type }) {
    return (
        <svg
            className="training-icon"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
        >
            {type === 'Kihon' && (
                <g
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 9 Q24 15 43 9" />
                    <path d="M8 19 H40" />
                    <path d="M15 12 L12 41" />
                    <path d="M33 12 L36 41" />
                    <path d="M24 13 V19" />
                </g>
            )}

            {type === 'Kata' && (
                <>
                    <path
                        d="M3 29 A23 23 0 0 1 45 29 L24 39 Z"
                        fill="currentColor"
                    />

                    <g
                        stroke="var(--color-surface)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    >
                        <path d="M24 36 L10 24" />
                        <path d="M24 36 L17 17" />
                        <path d="M24 36 V14" />
                        <path d="M24 36 L31 17" />
                        <path d="M24 36 L38 24" />
                    </g>

                    <path
                        d="M21 42 L27 35 M21 35 L27 42"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </>
            )}

            {type === 'Kumite' && (
                <g stroke="currentColor" strokeLinecap="round">
                    <path
                        d="M38 13 C29 3 12 7 7 20 C2 34 15 44 28 41
               C40 39 45 26 38 17 C32 10 21 10 15 16"
                        strokeWidth="4"
                    />
                    <path
                        d="M34 8 C21 1 7 11 8 25 C9 38 24 44 35 36"
                        strokeWidth="1.5"
                    />
                </g>
            )}
        </svg>
    )
}

export default TrainingIcon