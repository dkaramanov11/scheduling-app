import useTimeSlotActions from '../../hooks/useTimeSlotActions'
import '../../styles/availability/TimeSlotActions.css'

function TimeSlotActions({ slot, onScheduleChanged }) {
    const {
        canManage,
        isBookingUnavailable,
        isConfirming,
        isSubmitting,
        error,
        actionLabel,
        confirmationMessage,
        startConfirmation,
        dismissConfirmation,
        confirmAction,
    } = useTimeSlotActions({
        slot,
        onScheduleChanged,
    })

    if (!canManage) return null

    return (
        <div className="time-slot-actions" aria-busy={isSubmitting}>
            {isBookingUnavailable ? (
                <p role="alert">
                    Booking details are unavailable. Refresh the schedule.
                </p>
            ) : !isConfirming ? (
                <button
                    className="management-secondary-action"
                    type="button"
                    onClick={startConfirmation}
                >
                    {actionLabel}
                </button>
            ) : (
                <div className="management-confirmation">
                    <p>{confirmationMessage}</p>

                    <div className="management-confirmation-buttons">
                        <button
                            className="management-refresh"
                            type="button"
                            disabled={isSubmitting}
                            onClick={dismissConfirmation}
                        >
                            Keep it
                        </button>

                        <button
                            className="management-danger-button"
                            type="button"
                            disabled={isSubmitting}
                            onClick={confirmAction}
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