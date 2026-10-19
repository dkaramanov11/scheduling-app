import { useState } from 'react'
import { createTimeSlot } from '../services/timeSlotService'
import '../styles/BookingForm.css'

function CreateTimeSlotForm({ onTimeSlotCreated }) {
    const [startAt, setStartAt] = useState('')
    const [durationMinutes, setDurationMinutes] = useState(30)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        if (isSubmitting) return

        setIsSubmitting(true)
        setError('')
        setSuccessMessage('')

        try {
            await createTimeSlot({
                startAt: startAt.length === 16 ? `${startAt}:00` : startAt,
                durationMinutes: Number(durationMinutes),
            })
        } catch (error) {
            setError(
                error.status
                    ? error.message
                    : 'Unable to connect to the server. Please try again.'
            )
            setIsSubmitting(false)
            return
        }

        setSuccessMessage('Time slot created successfully.')
        setStartAt('')
        setIsSubmitting(false)
        onTimeSlotCreated()
    }

    return (
        <section className="availability" aria-labelledby="manage-title">
            <h2 id="manage-title">Manage availability</h2>
            <p>Create a time slot. Enter the time in Europe/Skopje.</p>

            <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="startAt">Date and time</label>
                    <input
                        id="startAt"
                        name="startAt"
                        type="datetime-local"
                        value={startAt}
                        onChange={(event) => setStartAt(event.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="durationMinutes">Duration in minutes</label>
                    <input
                        id="durationMinutes"
                        name="durationMinutes"
                        type="number"
                        min="1"
                        step="1"
                        value={durationMinutes}
                        onChange={(event) => setDurationMinutes(event.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                {error && <p role="alert">{error}</p>}

                {successMessage && (
                    <p role="status">{successMessage}</p>
                )}

                <button
                    className="primary-button"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create time slot'}
                </button>
            </form>
        </section>
    )
}

export default CreateTimeSlotForm