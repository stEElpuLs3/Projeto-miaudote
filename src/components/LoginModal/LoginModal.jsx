import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import LoginForm from '../LoginForm/LoginForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: "10px"
};

export default function LoginModal({open, onClose}) {
  return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="login-modal"
        aria-describedby="modal-login-form"
        sx={{border:'none'}}
      >
        <Box sx={style}>
          <LoginForm />
        </Box>
      </Modal>
  );
}

