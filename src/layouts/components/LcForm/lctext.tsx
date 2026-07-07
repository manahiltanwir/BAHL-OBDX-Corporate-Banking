import Typography from '@mui/material/Typography'

interface LCTextProps {
  children: React.ReactNode
  variant?: 'title' | 'section' | 'swift' | 'label' | 'value'
}

const styles = {
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#111827',
    mb: 3
  },

  section: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#6B7280',
    mb: 3
  },

  swift: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#111827',
    mt: 4,
    mb: 2
  },

  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1F2937',
    mb: 1
  },

  value: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#6B7280'
  }
}

const LCText = ({
  children,
  variant = 'label'
}: LCTextProps) => {
  return (
    <Typography sx={styles[variant]}>
      {children}
    </Typography>
  )
}

export default LCText