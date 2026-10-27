import { throwIfError } from './apiErrors'

export async function createBooking(booking) {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
    })

    await throwIfError(
        response,
        'Unable to book the session. Please try again.'
    )

    return response.json()
}

export async function cancelBooking(bookingId) {
    const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
    })

    await throwIfError(
        response,
        'Unable to cancel the booking. Please try again.'
    )
}