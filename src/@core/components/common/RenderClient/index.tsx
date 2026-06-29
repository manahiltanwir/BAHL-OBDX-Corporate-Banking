import CustomAvatar from 'src/@core/components/mui/avatar'
import { IRenderClient } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'


const RenderClient = ({imageUrl, avatarColor= 'primary', name, variant='circular' }:IRenderClient) => {
    if (imageUrl) {
        return (
            <CustomAvatar src={imageUrl} sx={{ mr: 3, width: 34, height: 34 }} variant={variant} />
        )
    } else {
        return (
            <CustomAvatar
                skin='light'
                color={avatarColor}
                sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
                variant={variant}
            >
                {getInitials(name)}
            </CustomAvatar>
        )
    }
}

export default RenderClient