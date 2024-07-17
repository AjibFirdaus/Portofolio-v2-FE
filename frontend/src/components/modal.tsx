import React from 'react';

interface ModalProps {
    id: string;
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ id, title, children, onClose }) => {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box max-h-[80vh] flex flex-col bg-slate-950">
                <div className="sticky top-0 z-10 flex justify-between items-center pb-2">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <form method='dialog'>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            ✕
                        </button>
                    </form>
                </div>
                <div className="modal-body overflow-y-auto flex-grow">
                    {children}
                </div>
            </div>

        </dialog>
    );
};

export default Modal;