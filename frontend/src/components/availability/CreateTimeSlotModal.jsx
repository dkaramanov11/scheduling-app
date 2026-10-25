import { useEffect, useRef } from 'react'
import CreateTimeSlotForm from '../CreateTimeSlotForm'
import '../../styles/availability/CreateTimeSlotModal.css'

function CreateTimeSlotModal({ onClose, onTimeSlotCreated }) {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        const previousFocus = document.activeElement

        dialog.showModal()

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            dialog.close()
            document.body.style.overflow = previousOverflow
            previousFocus?.focus()
        }
    }, [])

    return (
        <dialog
            ref={dialogRef}
            className="create-slot-modal"
            aria-labelledby="manage-title"
            onCancel={(event) => {
                event.preventDefault()
                onClose()
            }}
        >
            <button
                className="modal-close-button"
                type="button"
                aria-label="Close add time slot"
                onClick={onClose}
                autoFocus
            >
                ×
            </button>

            <CreateTimeSlotForm onTimeSlotCreated={onTimeSlotCreated} />
        </dialog>
    )
}

export default CreateTimeSlotModal