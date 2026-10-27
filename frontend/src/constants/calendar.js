export const WEEKDAYS = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
]

export const monthFormatter = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
})

export const dayFormatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeZone: 'UTC',
})