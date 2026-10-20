const timeZone = 'Europe/Skopje'

const dateKeyFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    dateStyle: 'full',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
})

export function getDateKey(value) {
    const parts = dateKeyFormatter.formatToParts(new Date(value))
    const year = parts.find((part) => part.type === 'year').value
    const month = parts.find((part) => part.type === 'month').value
    const day = parts.find((part) => part.type === 'day').value

    return `${year}-${month}-${day}`
}

export function formatDate(value) {
    return dateFormatter.format(new Date(value))
}

export function formatTime(value) {
    return timeFormatter.format(new Date(value))
}

export function formatTimeRange(startAt, endAt) {
    return `${formatTime(startAt)} – ${formatTime(endAt)}`
}