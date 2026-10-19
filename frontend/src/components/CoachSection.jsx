import '../styles/CoachSection.css'
import TrainingIcon from './TrainingIcon'
import coachBelt from '../assets/coach-belt.png'

const trainingAreas = [
    {
        title: 'Kihon',
        description:
            'Build strong fundamentals through focused, repeatable technique.',
    },
    {
        title: 'Kata',
        description:
            'Refine precision, rhythm, and control through traditional forms.',
    },
    {
        title: 'Kumite',
        description:
            'Develop timing, distance, and practical application in a controlled environment.',
    },
]

function CoachSection() {
    return (
        <section className="coach-section" id="coach" aria-labelledby="coach-title">
            <div className="coach-profile">
                <h2 id="coach-title">Meet your coach</h2>

                <div className="coach-profile-content">
                    <div className="coach-details">
                        <h3>Daniel Karamanov</h3>

                        <ul className="coach-credentials">
                            <li>Karate Black Belt</li>
                            <li>Former Karate Competitor</li>
                            <li>Licensed Balkan Karate Referee</li>
                        </ul>
                    </div>

                    <img
                        className="coach-belt"
                        src={coachBelt}
                        alt=""
                        width="1536"
                        height="1024"
                    />
                </div>
            </div>

            <div className="training-overview">
                <h2>A session built around you.</h2>

                <p className="training-description">
                    Whether you want to build a stronger foundation, refine your
                    technique, or develop fighting skills, each session is tailored
                    to your goals and experience.
                </p>

                <div className="training-cards">
                    {trainingAreas.map((area) => (
                        <article className="training-card" key={area.title}>
                            <TrainingIcon type={area.title} />

                            <div>
                                <h3>{area.title}</h3>
                                <p>{area.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CoachSection