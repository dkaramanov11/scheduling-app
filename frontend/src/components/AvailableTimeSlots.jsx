import { useEffect, useRef, useState } from 'react'
import { getAvailableTimeSlots } from '../services/timeSlotService'
import BookingCalendar from './BookingCalendar'
import BookingForm from './BookingForm'
import '../styles/AvailableTimeSlots.css'

const dateKeyFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Skopje',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Skopje',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
})

const headingFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
})

const sessionDateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Skopje',
    dateStyle: 'full',
})

function getDateKey(value) {
    const parts = dateKeyFormatter.formatToParts(new Date(value))
    const year = parts.find((part) => part.type === 'year').value
    const month = parts.find((part) => part.type === 'month').value
    const day = parts.find((part) => part.type === 'day').value

    return `${year}-${month}-${day}`
}

function AvailableTimeSlots({
                                refreshVersion = 0,
                                onBookingChanged,
                            }) {
    const hasInitialized = useRef(false)
    const [timeSlots, setTimeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [month, setMonth] = useState(() =>
        getDateKey(new Date()).slice(0, 7)
    )
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [bookingError, setBookingError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function loadTimeSlots() {
            setIsLoading(true)
            setError('')

            try {
                const data = await getAvailableTimeSlots(controller.signal)

                if (controller.signal.aborted) return

                const sortedSlots = [...data].sort(
                    (first, second) =>
                        new Date(first.startAt) - new Date(second.startAt)
                )

                setTimeSlots(sortedSlots)

                setSelectedSlot((current) =>
                    current
                        ? sortedSlots.find((slot) => slot.id === current.id) ?? null
                        : null
                )

                if (!hasInitialized.current && sortedSlots.length > 0) {
                    const firstDate = getDateKey(sortedSlots[0].startAt)
                    setSelectedDate(firstDate)
                    setMonth(firstDate.slice(0, 7))
                }

                hasInitialized.current = true
            } catch {
                if (!controller.signal.aborted) {
                    setError(
                        'Unable to load available sessions. Please try again.'
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadTimeSlots()

        return () => controller.abort()
    }, [refreshVersion])

    const availableDates = new Set(
        timeSlots.map((slot) => getDateKey(slot.startAt))
    )

    const dailySlots = timeSlots.filter(
        (slot) => getDateKey(slot.startAt) === selectedDate
    )

    function handleDateSelect(date) {
        setSelectedDate(date)
        setSelectedSlot(null)
        setSuccessMessage('')
        setBookingError('')
    }

    function handleMonthChange(nextMonth) {
        setMonth(nextMonth)
        setSelectedDate('')
        setSelectedSlot(null)
        setSuccessMessage('')
        setBookingError('')
    }

    function handleBookingSuccess(timeSlotId) {
        setTimeSlots((currentSlots) =>
            currentSlots.filter((slot) => slot.id !== timeSlotId)
        )
        setBookingError('')
        setSelectedSlot(null)
        setSuccessMessage(
            'Your karate session has been booked successfully.'
        )
        onBookingChanged()
    }

    function handleSlotUnavailable(timeSlotId, message) {
        setTimeSlots((currentSlots) =>
            currentSlots.filter((slot) => slot.id !== timeSlotId)
        )
        setSelectedSlot(null)
        setSuccessMessage('')
        setBookingError(message)
        onBookingChanged()
    }

    return (
        <section
            className="availability booking-panel"
            aria-labelledby="availability-title"
        >
            <BookingCalendar
                month={month}
                selectedDate={selectedDate}
                availableDates={availableDates}
                onMonthChange={handleMonthChange}
                onDateSelect={handleDateSelect}
            />

            <div className="session-booking">
                {successMessage && (
                    <p className="booking-message success" role="status">
                        {successMessage}
                    </p>
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

                {!isLoading && !error && timeSlots.length === 0 && (
                    <p role="status">
                        No available sessions right now. Please check back later.
                    </p>
                )}

                {!isLoading && !error && timeSlots.length > 0 && (
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
                                        aria-pressed={
                                            selectedSlot?.id === slot.id
                                        }
                                        onClick={() => {
                                            setSelectedSlot(slot)
                                            setSuccessMessage('')
                                            setBookingError('')
                                        }}
                                    >
                                        {timeFormatter.format(
                                            new Date(slot.startAt)
                                        )}
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

            <div className="session-summary">
                <h2 id="availability-title">Book your next session</h2>
                <p>Choose your day. Find your focus.</p>

                <div className="session-information">
                    <h3>Private karate session</h3>
                    <p>One-to-one training with Daniel Karamanov.</p>

                    {selectedSlot ? (
                        <dl className="session-details">
                            <div>
                                <dt>Date</dt>
                                <dd>
                                    {sessionDateFormatter.format(
                                        new Date(selectedSlot.startAt)
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt>Time</dt>
                                <dd>
                                    {timeFormatter.format(
                                        new Date(selectedSlot.startAt)
                                    )}
                                    {' – '}
                                    {timeFormatter.format(
                                        new Date(selectedSlot.endAt)
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt>Duration</dt>
                                <dd>
                                    {selectedSlot.durationMinutes} minutes
                                </dd>
                            </div>
                        </dl>
                    ) : (
                        <p className="session-selection-hint">
                            Choose a date and time to see your session details.
                        </p>
                    )}

                    <div className="training-tags" aria-label="Training areas">
                        <span>Kihon</span>
                        <span>Kata</span>
                        <span>Kumite</span>
                    </div>
                </div>
            </div>

            {selectedSlot && (
                <BookingForm
                    key={selectedSlot.id}
                    timeSlotId={selectedSlot.id}
                    onBookingSuccess={handleBookingSuccess}
                    onSlotUnavailable={handleSlotUnavailable}
                />
            )}
        </section>
    )
}

export default AvailableTimeSlots