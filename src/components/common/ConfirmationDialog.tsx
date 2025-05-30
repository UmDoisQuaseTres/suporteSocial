import React from 'react';
import Modal from './Modal';
import Button from './Button'; // Assuming a common Button component exists or will be created

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  confirmButtonVariant?: 'primary' | 'danger' | 'success' | 'warning'; // More flexible than isDestructive
  hideCancelButton?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false, // Kept for backward compatibility or simple use cases
  confirmButtonVariant, // Overrides isDestructive if set
  hideCancelButton = false,
}) => {
  if (!isOpen) {
    return null;
  }

  let determinedConfirmVariant: 'primary' | 'danger' | 'success' | 'warning' = 'primary';
  if (confirmButtonVariant) {
    determinedConfirmVariant = confirmButtonVariant;
  } else if (isDestructive) {
    determinedConfirmVariant = 'danger';
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="text-sm text-whatsapp-text-secondary mb-6">
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
      <div className="flex justify-end space-x-3">
        {!hideCancelButton && (
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
        )}
        <Button variant={determinedConfirmVariant} onClick={onConfirm} autoFocus>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog; 