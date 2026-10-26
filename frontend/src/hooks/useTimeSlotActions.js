import { useRef, useState } from 'react'
import { cancelBooking } from '../services/bookingService'
import { cancelTimeSlot } from '../services/timeSlotService'

export default function useTimeSlotActions({ slot, onScheduleChanged }) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const requestInProgress = useRef(false)

    const isBooked = slot.status === 'BOOKED'
    const isAvailable = slot.status === 'AVAILABLE'
    const canManage = isBooked || isAvailable
    const isBookingUnavailable = isBooked && slot.bookingId == null

    const actionLabel = isBooked ? 'Cancel booking' : 'Remove time slot'

    const confirmationMessage = isBooked
        ? 'Cancel this booking? The time slot will become available for booking again.'
        : 'Remove this time slot? It will no longer be available for booking.'

    function startConfirmation() {
        if (!canManage || isBookingUnavailable || requestInProgress.current) {
            return
        }

        setError('')
        setIsConfirming(true)
    }

    function dismissConfirmation() {
        if (requestInProgress.current) return

        setIsConfirming(false)
        setError('')
    }

    async function confirmAction() {
        if (!canManage || isBookingUnavailable || requestInProgress.current) {
            return
        }

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

    return {
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
    }
}