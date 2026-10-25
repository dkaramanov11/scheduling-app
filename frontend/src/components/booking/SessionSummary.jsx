import { formatDate, formatTimeRange } from '../../utils/dateTime'
import '../../styles/booking/SessionSummary.css'

function SessionSummary({ selectedSlot }) {
    return (
        <div className="session-summary">
            <h2 id="availability-title">Book your next session</h2>
            <p>Choose your day. Find your focus.</p>

            <div className="session-information">
                <h3>Private karate session</h3>
                <p>One-to-one training with Daniel Karamanov.</p>

                {selectedSlot ? (
                    <dl className="session-details">
                        <div>
                            <dt>Date</dt>
                            <dd>{formatDate(selectedSlot.startAt)}</dd>
                        </div>

                        <div>
                            <dt>Time</dt>
                            <dd>
                                {formatTimeRange(
                                    selectedSlot.startAt,
                                    selectedSlot.endAt
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt>Duration</dt>
                            <dd>{selectedSlot.durationMinutes} minutes</dd>
                        </div>
                    </dl>
                ) : (
                    <p className="session-selection-hint">
                        Choose a date and time to see your session details.
                    </p>
                )}

                <div className="training-tags" aria-label="Training areas">
                    <span>Kihon</span>
                    <span>Kata</span>
                    <span>Kumite</span>
                </div>
            </div>
        </div>
    )
}

export default SessionSummary