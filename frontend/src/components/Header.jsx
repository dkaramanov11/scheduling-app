import '../styles/Header.css'

function Header() {
    return (
        <header className="site-header">
            <a className="site-brand" href="#home" aria-label="Dojo Sessions home">
                <span className="brand-mark" aria-hidden="true" />
                <span>DOJO SESSIONS</span>
            </a>

            <nav className="site-navigation" aria-label="Main navigation">
                <a className="navigation-link" href="#training">
                    Training
                </a>

                <a className="navigation-link" href="#coach">
                    About the coach
                </a>

                <a className="primary-button" href="#booking">
                    Book a session
                </a>
            </nav>
        </header>
    )
}

export default Header