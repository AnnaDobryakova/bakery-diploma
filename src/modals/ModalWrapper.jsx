import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const ModalWrapper = ({children, open, onClose, maxWidth = 920, padding = 0, showClose = true,}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            >
            <Box sx={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth,
                bgcolor: 'background.paper',
                borderRadius: '48px',
                boxShadow: 24,
                p: padding,
                overflow: 'hidden',
                outline: 'none',
                gap: '25px',
             }}>
                {showClose && (
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}

                {children}
            </Box>
            </Modal>
    );
};

export default ModalWrapper