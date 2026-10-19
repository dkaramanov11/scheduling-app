export async function createBooking(booking) {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
    })

    if (!response.ok) {
        const problem = await response.json().catch(() => null)

        const error = new Error(
            problem?.detail || 'Unable to book the meeting. Please try again.'
        )

        error.status = response.status
        error.errors = problem?.errors

        throw error
    }

    return response.json()
}