import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../../components/ui/Modal';
import { ModalActions, useModal } from '../../components/ui/modalUtils';
import { Button } from '../../components/ui/Button';

describe('UI Modal Component', () => {
  it('renders when open', () => {
    render(
      <Modal open title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('shows close button by default', () => {
    render(
      <Modal open title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
  });

  it('hides close button when specified', () => {
    render(
      <Modal open title="Test Modal" showCloseButton={false}>
        <p>Content</p>
      </Modal>
    );

    expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal open title="Test Modal" onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: 'Fermer' });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders actions correctly', () => {
    render(
      <Modal 
        open 
        title="Test Modal" 
        actions={
          <>
            <Button>Cancel</Button>
            <Button>Save</Button>
          </>
        }
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <Modal open>
        <p>Content without title</p>
      </Modal>
    );

    expect(screen.getByText('Content without title')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

describe('ModalActions', () => {
  it('renders Confirm actions correctly', async () => {
    const handleCancel = vi.fn();
    const handleConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal 
        open 
        actions={
          <ModalActions.Confirm 
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        }
      >
        <p>Content</p>
      </Modal>
    );

    const cancelButton = screen.getByRole('button', { name: 'Annuler' });
    const confirmButton = screen.getByRole('button', { name: 'Confirmer' });

    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);

    await user.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders Save actions correctly', async () => {
    const handleCancel = vi.fn();
    const handleSave = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal 
        open 
        actions={
          <ModalActions.Save 
            onCancel={handleCancel}
            onSave={handleSave}
          />
        }
      >
        <p>Content</p>
      </Modal>
    );

    const cancelButton = screen.getByRole('button', { name: 'Annuler' });
    const saveButton = screen.getByRole('button', { name: 'Sauvegarder' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);

    await user.click(saveButton);
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('shows loading state in actions', () => {
    const handleCancel = vi.fn();
    const handleSave = vi.fn();

    render(
      <Modal 
        open 
        actions={
          <ModalActions.Save 
            onCancel={handleCancel}
            onSave={handleSave}
            loading
          />
        }
      >
        <p>Content</p>
      </Modal>
    );

    const cancelButton = screen.getByRole('button', { name: 'Annuler' });
    const saveButton = screen.getByRole('button', { name: 'Sauvegarder' });

    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });
});

// Test du hook useModal
function TestModalHook() {
  const { open, openModal, closeModal } = useModal();
  
  return (
    <>
      <Button onClick={openModal}>Open Modal</Button>
      <Modal open={open} onClose={closeModal} title="Test Hook">
        <p>Modal opened with hook</p>
      </Modal>
    </>
  );
}

describe('useModal hook', () => {
  it('manages modal state correctly', async () => {
    const user = userEvent.setup();
    render(<TestModalHook />);

    // Modal should be closed initially
    expect(screen.queryByText('Test Hook')).not.toBeInTheDocument();

    // Open modal
    const openButton = screen.getByRole('button', { name: 'Open Modal' });
    await user.click(openButton);

    expect(screen.getByText('Test Hook')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole('button', { name: 'Fermer' });
    await user.click(closeButton);

    expect(screen.queryByText('Test Hook')).not.toBeInTheDocument();
  });
});