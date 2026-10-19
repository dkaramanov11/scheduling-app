import { useEffect, useState } from 'react'
import { getAvailableTimeSlots } from '../services/timeSlotService'
import BookingForm from './BookingForm'
import '../styles/AvailableTimeSlots.css'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Skopje',
    dateStyle: 'full',
    timeStyle: 'short',
})

function AvailableTimeSlots() {
    const [timeSlots, setTimeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [bookingError, setBookingError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function loadTimeSlots() {
            try {
                const data = await getAvailableTimeSlots(controller.signal)

                if (!controller.signal.aborted) {
                    setTimeSlots(data)
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError('Unable to load available time slots. Please try again.')
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadTimeSlots()

        return () => controller.abort()
    }, [])

    function handleBookingSuccess(timeSlotId) {
        setTimeSlots((currentSlots) =>
            currentSlots.filter((slot) => slot.id !== timeSlotId)
        )
        setBookingError('')
        setSelectedSlot(null)
        setSuccessMessage('Your meeting has been booked successfully.')
    }

    function handleSlotUnavailable(timeSlotId, message) {
        setTimeSlots((currentSlots) =>
            currentSlots.filter((slot) => slot.id !== timeSlotId)
        )
        setSelectedSlot(null)
        setSuccessMessage('')
        setBookingError(message)
    }

    return (
        <section className="availability" aria-labelledby="availability-title">
            <h2 id="availability-title">Available time slots</h2>
            <p>All times are shown in Europe/Skopje.</p>
            {successMessage && (
                <p role="status">{successMessage}</p>
            )}

            {bookingError && (
                <p role="alert">{bookingError}</p>
            )}

            {isLoading && (
                <p role="status">Loading available time slots...</p>
            )}

            {!isLoading && error && (
                <p role="alert">{error}</p>
            )}

            {!isLoading && !error && timeSlots.length === 0 && (
                <p role="status">
                    No available time slots right now. Please check back later.
                </p>
            )}

            {!isLoading && !error && timeSlots.length > 0 && (
                <ul className="time-slot-list">
                    {timeSlots.map((slot) => (
                        <li key={slot.id}>
                            <button
                                type="button"
                                className={
                                    selectedSlot?.id === slot.id
                                        ? 'time-slot-button selected'
                                        : 'time-slot-button'
                                }
                                aria-pressed={selectedSlot?.id === slot.id}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {dateFormatter.format(new Date(slot.startAt))}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {selectedSlot && (
                <div className="selected-slot">
                    <h3>Selected time slot</h3>
                    <p>
                        {dateFormatter.format(new Date(selectedSlot.startAt))}
                        {' — Europe/Skopje'}
                    </p>
                    <BookingForm
                        key={selectedSlot.id}
                        timeSlotId={selectedSlot.id}
                        onBookingSuccess={handleBookingSuccess}
                        onSlotUnavailable={handleSlotUnavailable}
                    />
                </div>
            )}
        </section>
    )
}

export default AvailableTimeSlots