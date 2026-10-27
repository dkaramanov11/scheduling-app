import useModalDialog from '../../../hooks/useModalDialog.js'
import CreateTimeSlotForm from './CreateTimeSlotForm.jsx'
import '../../../styles/availability/CreateTimeSlotModal.css'

function CreateTimeSlotModal({ onClose, onTimeSlotCreated }) {
    const dialogRef = useModalDialog()

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