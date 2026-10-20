import { useRef, useState } from 'react'
import { cancelBooking } from '../../services/bookingService'
import { cancelTimeSlot } from '../../services/timeSlotService'

function TimeSlotActions({ slot, onScheduleChanged }) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const requestInProgress = useRef(false)

    const isBooked = slot.status === 'BOOKED'
    const isAvailable = slot.status === 'AVAILABLE'

    if (!isBooked && !isAvailable) return null

    const actionLabel = isBooked ? 'Cancel booking' : 'Remove time slot'

    async function handleConfirm() {
        if (requestInProgress.current) return

        requestInProgress.current = true
        setIsSubmitting(true)
        setError('')

        try {
            if (isBooked) {
                await cancelBooking(slot.bookingId)
            } else {
                await cancelTimeSlot(slot.id)
            }
        } catch (error) {
            setError(error.message || 'Unable to complete the action.')
            setIsSubmitting(false)
            requestInProgress.current = false
            return
        }

        onScheduleChanged(
            isBooked
                ? 'Booking cancelled. The time slot is available again.'
                : 'Time slot removed from the schedule.'
        )
    }

    return (
        <div className="time-slot-actions" aria-busy={isSubmitting}>
            {isBooked && slot.bookingId == null ? (
                <p role="alert">
                    Booking details are unavailable. Refresh the schedule.
                </p>
            ) : !isConfirming ? (
                <button
                    className="management-danger-button"
                    type="button"
                    onClick={() => setIsConfirming(true)}
                >
                    {actionLabel}
                </button>
            ) : (
                <div className="management-confirmation">
                    <p>
                        {isBooked
                            ? 'Cancel this booking? The time slot will become available for booking again.'
                            : 'Remove this time slot? It will no longer be available for booking.'}
                    </p>

                    <div className="management-confirmation-buttons">
                        <button
                            className="management-refresh"
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setIsConfirming(false)
                                setError('')
                            }}
                        >
                            Keep it
                        </button>

                        <button
                            className="management-danger-button"
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleConfirm}
                        >
                            {isSubmitting ? 'Processing...' : actionLabel}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <p className="management-action-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

export default TimeSlotActions