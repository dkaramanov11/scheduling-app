import { useState } from 'react'
import { createBooking } from '../services/bookingService.js'

export default function useBookingForm({
                                           timeSlotId,
                                           onBookingSuccess,
                                           onSlotUnavailable,
                                       }) {
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [trainingFocus, setTrainingFocus] = useState('')
    const [experienceLevel, setExperienceLevel] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        if (isSubmitting) return

        const name = customerName.trim()
        const email = customerEmail.trim()

        if (!name) {
            setError('Please enter your full name.')
            return
        }

        if (!email) {
            setError('Please enter your email address.')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            await createBooking({
                timeSlotId,
                customerName: name,
                customerEmail: email,
                ...(trainingFocus && { trainingFocus }),
                ...(experienceLevel && { experienceLevel }),
            })
        } catch (error) {
            if (error.status === 409 || error.status === 404) {
                const message = error.status === 409
                    ? 'This session is no longer available. Please choose another.'
                    : 'This session no longer exists. Please choose another.'

                onSlotUnavailable(timeSlotId, message)
                return
            }

            setError(
                error.status === 400
                    ? 'Please check your details and try again.'
                    : 'Unable to complete your booking. Please try again.'
            )
            setIsSubmitting(false)
            return
        }

        onBookingSuccess(timeSlotId)
    }

    return {
        customerName,
        customerEmail,
        trainingFocus,
        experienceLevel,
        isSubmitting,
        error,
        setCustomerName,
        setCustomerEmail,
        setTrainingFocus,
        setExperienceLevel,
        handleSubmit,
    }
}