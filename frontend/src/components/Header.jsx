import '../styles/Header.css'

function Header({
                    activeView,
                    onBookingNavigation,
                    onManageNavigation,
                }) {
    return (
        <header className="site-header">
            <a
                className="site-brand"
                href="#home"
                aria-label="Dojo Sessions home"
                onClick={(event) => onBookingNavigation(event, 'home')}
            >
                <span className="brand-mark" aria-hidden="true" />
                <span>DOJO SESSIONS</span>
            </a>

            <nav className="site-navigation" aria-label="Main navigation">
                <a
                    className="navigation-link"
                    href="#training"
                    onClick={(event) =>
                        onBookingNavigation(event, 'training')
                    }
                >
                    Training
                </a>

                <a
                    className="navigation-link"
                    href="#coach"
                    onClick={(event) =>
                        onBookingNavigation(event, 'coach')
                    }
                >
                    About the coach
                </a>

                <button
                    className={
                        activeView === 'manage'
                            ? 'navigation-link navigation-button active'
                            : 'navigation-link navigation-button'
                    }
                    type="button"
                    aria-pressed={activeView === 'manage'}
                    onClick={onManageNavigation}
                >
                    Manage availability
                </button>

                <a
                    className="primary-button"
                    href="#booking"
                    onClick={(event) =>
                        onBookingNavigation(event, 'booking')
                    }
                >
                    Book a session
                </a>
            </nav>
        </header>
    )
}

export default Header