import useBookingForm from '../../hooks/useBookingForm'
import '../../styles/booking/BookingForm.css'

function BookingForm({
                         timeSlotId,
                         onBookingSuccess,
                         onSlotUnavailable,
                     }) {
    const {
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
    } = useBookingForm({
        timeSlotId,
        onBookingSuccess,
        onSlotUnavailable,
    })

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