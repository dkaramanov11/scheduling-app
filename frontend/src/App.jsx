import { useState } from 'react'
import Header from './components/Header'
import AvailableTimeSlots from './components/AvailableTimeSlots'
import CreateTimeSlotForm from './components/CreateTimeSlotForm'
import Hero from './components/Hero'
import CoachSection from './components/CoachSection'
import './styles/App.css'

function App() {
    const [availabilityVersion, setAvailabilityVersion] = useState(0)
    const [activeView, setActiveView] = useState('booking')

    function handleTimeSlotCreated() {
        setAvailabilityVersion((current) => current + 1)
    }

    function handleBookingNavigation(event, sectionId) {
        event.preventDefault()
        setActiveView('booking')

        requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({
                block: 'start',
            })
        })
    }

    function handleManageNavigation() {
        setActiveView('manage')
        window.scrollTo({ top: 0 })
    }

    return (
        <div className="app" id="home">
            <Header
                activeView={activeView}
                onBookingNavigation={handleBookingNavigation}
                onManageNavigation={handleManageNavigation}
            />

            <main>
                {activeView === 'booking' ? (
                    <>
                        <Hero />

                        <div id="booking">
                            <AvailableTimeSlots key={availabilityVersion} />
                        </div>

                        <CoachSection />
                    </>
                ) : (
                    <div className="manage-view">
                        <p className="manage-eyebrow">Coach workspace</p>

                        <CreateTimeSlotForm
                            onTimeSlotCreated={handleTimeSlotCreated}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}

export default App