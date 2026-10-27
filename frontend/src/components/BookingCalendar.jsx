import '../styles/shared/BookingCalendar.css'
import {
    WEEKDAYS,
    monthFormatter,
    dayFormatter,
} from '../constants/calendar'

function BookingCalendar({
                             month,
                             selectedDate,
                             availableDates,
                             onMonthChange,
                             onDateSelect,
                             hint = 'Select a date with available sessions.',
                         }) {
    const [year, monthNumber] = month.split('-').map(Number)
    const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1))
    const offset = (firstDay.getUTCDay() + 6) % 7

    const daysInMonth = new Date(
        Date.UTC(year, monthNumber, 0)
    ).getUTCDate()

    const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7

    function changeMonth(amount) {
        const nextMonth = new Date(
            Date.UTC(year, monthNumber - 1 + amount, 1)
        )

        onMonthChange(nextMonth.toISOString().slice(0, 7))
    }

    return (
        <div className="booking-calendar">
            <div className="calendar-heading">
                <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => changeMonth(-1)}
                >
                    ‹
                </button>

                <h3 aria-live="polite">
                    {monthFormatter.format(firstDay)}
                </h3>

                <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => changeMonth(1)}
                >
                    ›
                </button>
            </div>

            <div className="calendar-weekdays" aria-hidden="true">
                {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            <div className="calendar-days">
                {Array.from({ length: cellCount }, (_, index) => {
                    const date = new Date(
                        Date.UTC(year, monthNumber - 1, index - offset + 1)
                    )

                    const dateKey = date.toISOString().slice(0, 10)
                    const isCurrentMonth = date.getUTCMonth() === monthNumber - 1
                    const isAvailable = isCurrentMonth && availableDates.has(dateKey)
                    const isSelected = selectedDate === dateKey

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            className={
                                isSelected ? 'calendar-day selected' : 'calendar-day'
                            }
                            disabled={!isAvailable}
                            aria-label={dayFormatter.format(date)}
                            aria-pressed={isSelected}
                            onClick={() => onDateSelect(dateKey)}
                        >
                            {date.getUTCDate()}
                        </button>
                    )
                })}
            </div>

            <p className="calendar-hint">{hint}</p>
        </div>
    )
}

export default BookingCalendar