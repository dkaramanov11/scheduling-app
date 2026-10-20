import { useState } from 'react'
import { createTimeSlot } from '../services/timeSlotService'
import '../styles/BookingForm.css'
import '../styles/CreateTimeSlotForm.css'

const hours = Array.from({ length: 24 }, (_, index) =>
    String(index).padStart(2, '0')
)

const minutes = Array.from({ length: 12 }, (_, index) =>
    String(index * 5).padStart(2, '0')
)

function CreateTimeSlotForm({ onTimeSlotCreated }) {
    const [date, setDate] = useState('')
    const [hour, setHour] = useState('')
    const [minute, setMinute] = useState('00')
    const [duration, setDuration] = useState('30')
    const [customDuration, setCustomDuration] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const durationMinutes = Number(
        duration === 'custom' ? customDuration : duration
    )

    async function handleSubmit(event) {
        event.preventDefault()

        if (isSubmitting) return

        if (!date || !hour || !minute) {
            setError('Please select a date and start time.')
            return
        }

        if (
            !Number.isInteger(durationMinutes) ||
            durationMinutes < 1
        ) {
            setError('Please enter a valid duration in whole minutes.')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            await createTimeSlot({
                startAt: `${date}T${hour}:${minute}:00`,
                durationMinutes,
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

        setDate('')
        setHour('')
        setMinute('00')
        setIsSubmitting(false)
        onTimeSlotCreated()
    }

    return (
        <section
            className="availability create-slot-section"
            aria-labelledby="manage-title"
        >
            <h2 id="manage-title">Add time slot</h2>
            <p>Choose a date, start time and training duration.</p>

            <form
                className="booking-form create-slot-form"
                onSubmit={handleSubmit}
                aria-busy={isSubmitting}
            >
                <div className="form-field">
                    <label htmlFor="slotDate">Date</label>
                    <input
                        id="slotDate"
                        name="slotDate"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <fieldset className="slot-time-field">
                    <legend>Start time</legend>

                    <div className="slot-time-controls">
                        <div className="form-field">
                            <label htmlFor="slotHour">Hour</label>
                            <select
                                id="slotHour"
                                name="slotHour"
                                value={hour}
                                onChange={(event) => setHour(event.target.value)}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="">Select</option>
                                {hours.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <span className="slot-time-separator" aria-hidden="true">
                            :
                        </span>

                        <div className="form-field">
                            <label htmlFor="slotMinute">Minute</label>
                            <select
                                id="slotMinute"
                                name="slotMinute"
                                value={minute}
                                onChange={(event) => setMinute(event.target.value)}
                                disabled={isSubmitting}
                                required
                            >
                                {minutes.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <p className="slot-time-hint">
                        24-hour format, for example 18:30.
                    </p>
                </fieldset>

                <div className="form-field">
                    <label htmlFor="slotDuration">Duration</label>
                    <select
                        id="slotDuration"
                        name="slotDuration"
                        value={duration}
                        onChange={(event) => setDuration(event.target.value)}
                        disabled={isSubmitting}
                    >
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                        <option value="custom">Other duration</option>
                    </select>
                </div>

                {duration === 'custom' && (
                    <div className="form-field">
                        <label htmlFor="customDuration">
                            Duration in minutes
                        </label>
                        <input
                            id="customDuration"
                            name="customDuration"
                            type="number"
                            min="1"
                            step="1"
                            value={customDuration}
                            onChange={(event) =>
                                setCustomDuration(event.target.value)
                            }
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                )}

                {error && <p role="alert">{error}</p>}

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