import { useState } from 'react'
import { createBooking } from '../services/bookingService'
import '../styles/BookingForm.css'

function BookingForm({
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

    return (
        <form
            className="booking-form"
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
        >
            <div className="form-field">
                <label htmlFor="customerName">Full name</label>

                <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={customerName}
                    disabled={isSubmitting}
                    onChange={(event) => setCustomerName(event.target.value)}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="customerEmail">Email address</label>

                <input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={customerEmail}
                    disabled={isSubmitting}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="trainingFocus">
                    Training focus
                    <span className="optional-label"> (optional)</span>
                </label>

                <select
                    id="trainingFocus"
                    name="trainingFocus"
                    value={trainingFocus}
                    disabled={isSubmitting}
                    onChange={(event) => setTrainingFocus(event.target.value)}
                >
                    <option value="">Discuss with the coach</option>
                    <option value="KIHON">Kihon — fundamentals</option>
                    <option value="KATA">Kata — forms</option>
                    <option value="KUMITE">Kumite — sparring</option>
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="experienceLevel">
                    Experience level
                    <span className="optional-label"> (optional)</span>
                </label>

                <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={experienceLevel}
                    disabled={isSubmitting}
                    onChange={(event) => setExperienceLevel(event.target.value)}
                >
                    <option value="">Select your level</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                </select>
            </div>

            {error && (
                <p className="booking-form-error" role="alert">
                    {error}
                </p>
            )}

            <button
                className="primary-button"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Booking...' : 'Confirm booking'}
            </button>
        </form>
    )
}

export default BookingForm