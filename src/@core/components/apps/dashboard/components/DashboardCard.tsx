import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

interface DashboardCardProps {
    image: string
    title: string
    label: string
}

const DashboardCard = (props: DashboardCardProps) => {

    const { image, label, title } = props;

    return (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                border: '1px solid transparent',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,105,62,0.18)',
                    borderColor: '#0AA06E'
                }
            }}
        >
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