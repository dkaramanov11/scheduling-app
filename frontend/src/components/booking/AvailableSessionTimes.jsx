import { formatTime } from '../../utils/dateTime'

const headingFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
})

function AvailableSessionTimes({
                                   isLoading,
                                   error,
                                   hasTimeSlots,
                                   selectedDate,
                                   selectedSlot,
                                   dailySlots,
                                   successMessage,
                                   bookingError,
                                   onSlotSelect,
                                   onDismissSuccess,
                               }) {
    return (
        <div className="session-booking">
            {successMessage && (
                <div
                    className="booking-message success dismissible-message"
                    role="status"
                >
                    <span>{successMessage}</span>

                    <button
                        className="message-dismiss"
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={onDismissSuccess}
                    >
                        ×
                    </button>
                </div>
            )}

            {bookingError && (
                <p className="booking-message" role="alert">
                    {bookingError}
                </p>
            )}

            {isLoading && (
                <p role="status">Loading available sessions...</p>
            )}

            {!isLoading && error && (
                <p role="alert">{error}</p>
            )}

            {!isLoading && !error && !hasTimeSlots && (
                <p role="status">
                    No available sessions right now. Please check back later.
                </p>
            )}

            {!isLoading && !error && hasTimeSlots && (
                <>
                    <h3 className="session-date">
                        {selectedDate
                            ? headingFormatter.format(
                                new Date(`${selectedDate}T00:00:00Z`)
                            )
                            : 'Choose a date'}
                    </h3>

                    {!selectedDate && (
                        <p className="session-empty-state">
                            Select an available date in the calendar.
                        </p>
                    )}

                    {selectedDate && dailySlots.length === 0 && (
                        <p role="status">
                            No remaining sessions on this date.
                            Please choose another.
                        </p>
                    )}

                    <ul className="time-slot-list">
                        {dailySlots.map((slot) => (
                            <li key={slot.id}>
                                <button
                                    type="button"
                                    className={
                                        selectedSlot?.id === slot.id
                                            ? 'time-slot-button selected'
                                            : 'time-slot-button'
                                    }
                                    aria-pressed={selectedSlot?.id === slot.id}
                                    onClick={() => onSlotSelect(slot)}
                                >
                                    {formatTime(slot.startAt)}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {!selectedSlot && dailySlots.length > 0 && (
                        <p className="session-empty-state">
                            Choose a time to continue.
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

export default AvailableSessionTimes