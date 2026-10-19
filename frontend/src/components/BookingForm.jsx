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

        setIsSubmitting(true)
        setError('')

        try {
            await createBooking({
                timeSlotId,
                customerName: name,
                customerEmail: email,
            })
        } catch (error) {
            if (error.status === 409 || error.status === 404) {
                const message = error.status === 409
                    ? 'This time slot has already been booked. Please choose another.'
                    : 'This time slot no longer exists. Please choose another.'

                onSlotUnavailable(timeSlotId, message)
                return
            }

            setError('Unable to complete your booking. Please try again.')
            setIsSubmitting(false)
            return
        }

        onBookingSuccess(timeSlotId)
    }

    return (
        <form className="booking-form" onSubmit={handleSubmit}>
            <h3>Your details</h3>

            <div className="form-field">
                <label htmlFor="customerName">Full name</label>
                <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    autoComplete="name"
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
                    value={customerEmail}
                    disabled={isSubmitting}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    required
                />
            </div>

            {error && <p role="alert">{error}</p>}
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