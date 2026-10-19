import karateHero from '../assets/karate-hero.png'
import '../styles/Hero.css'

function Hero() {
    return (
        <section className="hero" id="training" aria-labelledby="hero-title">
            <div className="hero-content">
                <p className="hero-eyebrow">Private karate training</p>

                <h1 id="hero-title">
                    Train with purpose.
                    <br />
                    Progress with confidence.
                </h1>

                <p className="hero-description">
                    One-to-one coaching. Your goals. Your pace.
                </p>
            </div>

            <img
                className="hero-artwork"
                src={karateHero}
                alt=""
                width="1536"
                height="1024"
            />
        </section>
    )
}

export default Hero