import {
    WEEKDAYS,
    monthFormatter,
    dayFormatter,
} from '../../constants/calendar.js'
import { getCalendarDays, shiftMonth } from '../../utils/calendar.js'
import '../../styles/shared/BookingCalendar.css'

function BookingCalendar({
                             month,
                             selectedDate,
                             availableDates,
                             onMonthChange,
                             onDateSelect,
                             hint = 'Select a date with available sessions.',
                         }) {
    const { firstDay, days } = getCalendarDays(month)

    function changeMonth(amount) {
        onMonthChange(shiftMonth(month, amount))
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
                {days.map(({ date, dateKey, isCurrentMonth }) => {
                    const isAvailable =
                        isCurrentMonth && availableDates.has(dateKey)

                    const isSelected = selectedDate === dateKey

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            className={
                                isSelected
                                    ? 'calendar-day selected'
                                    : 'calendar-day'
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