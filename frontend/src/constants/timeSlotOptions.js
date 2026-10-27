export const HOURS = Array.from({ length: 24 }, (_, index) =>
    String(index).padStart(2, '0')
)

export const MINUTES = Array.from({ length: 12 }, (_, index) =>
    String(index * 5).padStart(2, '0')
)