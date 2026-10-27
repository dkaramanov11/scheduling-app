export function getCalendarDays(month) {
    const [year, monthNumber] = month.split('-').map(Number)

    const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1))
    const offset = (firstDay.getUTCDay() + 6) % 7

    const daysInMonth = new Date(
        Date.UTC(year, monthNumber, 0)
    ).getUTCDate()

    const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7

    const days = Array.from({ length: cellCount }, (_, index) => {
        const date = new Date(
            Date.UTC(year, monthNumber - 1, index - offset + 1)
        )

        return {
            date,
            dateKey: date.toISOString().slice(0, 10),
            isCurrentMonth: date.getUTCMonth() === monthNumber - 1,
        }
    })

    return { firstDay, days }
}

export function shiftMonth(month, amount) {
    const [year, monthNumber] = month.split('-').map(Number)

    const nextMonth = new Date(
        Date.UTC(year, monthNumber - 1 + amount, 1)
    )

    return nextMonth.toISOString().slice(0, 7)
}