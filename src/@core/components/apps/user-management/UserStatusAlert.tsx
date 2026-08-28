
// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Import Custom hooks
import useToggleDrawer from "src/@core/hooks/useToggleDrawer"

import { ModalType } from 'src/types'

const UserStatusAlert = ({
    title = 'records',
    type = ModalType.DEFAULT,
    onAgree,
}: { title?: string, onAgree: () => void, type?: ModalType }) => {

    let dialogForResetPass = 'Are you sure you want to reset the password? '
    let dialogForResetUserName = 'Are you sure you want to reset the User Name? '
    let dialogForActiveUser = 'Are you sure you want to active the user? '
    let dialogForInActiveUser = 'Are you sure you want to inactive the user? '
    // ** hooks
    const { isModalOpen, handleModal, modalType } = useToggleDrawer();
    const handleClose = () => handleModal(null)

    console.log(title);
    

    return (
        <Dialog
            open={(isModalOpen && modalType === type)}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{title == 'Reset Password' ? dialogForResetPass : title == 'Reset User Name' ? dialogForResetUserName : title == 'Active User Status' ? dialogForActiveUser : title == 'Inactive User Status' ? dialogForInActiveUser : ''}</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    This process cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
                <Button onClick={onAgree}>Yes</Button>
                <Button onClick={handleClose}>No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UserStatusAlert
