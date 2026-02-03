import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { confirmModal, hideModal } from '../actions/modal';
import './styles.css';

// ============================================================================================
// Component
// ============================================================================================

const Modal = ({ modalData }: any) => {
    const dispatch = useDispatch();

    // Return JSX
    const returnJSX = (
        <>
            <div className='modal-container'>
                <div className='modal'>
                    {/* Modal heading */}
                    <h1 className='modal-header'>{modalData?.heading}</h1>
                    {/* X button */}
                    <button
                        onClick={() => dispatch(hideModal())}
                        className='modal-close'
                    >
                        X
                    </button>
                    <div className='modal-btn-group'>
                        {/* Confirm button */}
                        <button
                            onClick={() => dispatch(confirmModal())}
                            className='btn btn-outline modal-btn'
                        >
                            Ok
                        </button>
                        {/* Cancel button */}
                        <button
                            onClick={() => dispatch(hideModal())}
                            className='btn btn-outline modal-btn'
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    // React Portal
    return ReactDOM.createPortal(returnJSX, document.getElementById('modal')!);
};

// ============================================================================================

export default Modal;
