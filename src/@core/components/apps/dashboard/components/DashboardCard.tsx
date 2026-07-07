import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";


interface DashboardCardProps {
    image: string
    title: string
    label: string
}


const DashboardCard = (props:DashboardCardProps) => {

    const { image,label,title } = props;
    
    return(
        <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar variant='rounded' sx={{ mr: 3, width: 50, height: 42, backgroundColor: 'background.default' }}>
                  <img alt='avatar' src={image} width={22} height={22} />
                </Avatar>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
                    <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                      {title}
                    </Typography>
                    <Typography variant='caption'>PKR 42,300</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
    )
}

export default DashboardCard;