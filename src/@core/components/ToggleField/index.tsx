import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

export interface SegmentedOption {
  value: string
  label: string
}

// ** Default enable/disable options used by every toggle field unless overridden
const defaultToggleOptions: SegmentedOption[] = [
  { value: 'enable', label: 'Enable' },
  { value: 'disable', label: 'Disable' }
]

const StyledPreferenceRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '200px 1fr',
  columnGap: theme.spacing(3),
  alignItems: 'center',
  justifyItems: 'start',
  padding: theme.spacing(1.5, 0),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    rowGap: theme.spacing(1)
  }
}))

const StyledPreferenceLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4
}))

const StyledSegmentedWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  padding: 4,
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  gap: 2
}))

interface SegmentedButtonProps {
  active?: boolean
}

const StyledSegmentedButton = styled(Box, {
  shouldForwardProp: prop => prop !== 'active'
})<SegmentedButtonProps>(({ theme, active }) => ({
  padding: theme.spacing(0.75, 2),
  borderRadius: 999,
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'all 0.2s ease',
  color: active ? '#ffffff' : theme.palette.text.secondary,
  backgroundColor: active ? '#15804f' : 'transparent',
  boxShadow: active ? '0 2px 6px rgba(16, 185, 129, 0.35)' : 'none',
  '&:hover': {
    backgroundColor: active ? '#15804f' : theme.palette.action.selected,
    color: active ? '#ffffff' : theme.palette.text.primary
  }
}))

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
}

const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => (
  <StyledSegmentedWrapper>
    {options.map(opt => (
      <StyledSegmentedButton key={opt.value} active={opt.value === value} onClick={() => onChange(opt.value)}>
        {opt.label}
      </StyledSegmentedButton>
    ))}
  </StyledSegmentedWrapper>
)

export interface ToggleFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options?: SegmentedOption[]
}

const ToggleField = ({ label, value, onChange, options = defaultToggleOptions }: ToggleFieldProps) => (
  <StyledPreferenceRow>
    <StyledPreferenceLabel>{label}</StyledPreferenceLabel>
    <SegmentedControl options={options} value={value} onChange={onChange} />
  </StyledPreferenceRow>
)

export default ToggleField