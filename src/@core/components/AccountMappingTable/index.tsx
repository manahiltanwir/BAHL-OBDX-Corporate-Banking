import React from 'react'

import { Box, Button, Checkbox, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

// ** Shared account row type (same shape used on the page)
export interface AccountRow {
  id: string
  accountNumber: string
  currency: string
  productName: string
  status: string
}

export interface AccountMappingTableProps {
  // Header
  icon: React.ReactNode
  title: string
  countLabel: string
  countValue: number

  // "Select all" toggle row
  toggleAllLabel: string
  toggleAllChecked: boolean
  toggleAllDisabled: boolean
  onToggleAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void

  // Rows
  accounts: AccountRow[]
  selectedIds: string[]
  onSelectAccount: (accountId: string) => void
  emptyMessage?: string

  // Optional: mark rows as "Already Mapped" (used only by the Active Accounts table).
  // When an account id is present here, its checkbox is hidden and a
  // "Already Mapped" label replaces the status text.
  alreadyMappedIds?: string[]

  // Save / action button
  saveButtonLabel: string
  saveButtonIcon: React.ReactNode
  onSave: () => void
  saveDisabled: boolean
  saveButtonVariant?: 'contained' | 'outlined'
  saveButtonColor?: 'primary' | 'error'
  saveButtonSx?: SxProps<Theme>

  // Row highlight color for "already mapped" rows (theme-aware, passed from parent)
  mappedRowBg?: string
}

const colors = {
  green: '#15804f'
}

const styles: Record<string, SxProps<Theme>> = {
  tableContainer: {
    flex: 1,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'hidden'
  },
  tableHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 2.5
  },
  tableHeaderLeft: { display: 'flex', alignItems: 'center', gap: 1.5 },
  tableIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#E7F5F0',
    color: colors.green
  },
  tableHeaderTitle: { fontWeight: 700 },
  tableHeaderCountWrapper: { textAlign: 'right' },
  tableHeaderCountLabel: { color: colors.green, fontWeight: 600 },
  tableHeaderCountValue: { fontWeight: 700, color: colors.green },
  tableToggleAllRow: { px: 2.5, pb: 1.5, display: 'flex', alignItems: 'center' },
  tableScrollWrapper: { overflowX: 'auto' },
  tableMinWidthWrapper: { minWidth: 480 },
  tableGridHeader: {
    display: 'grid',
    gridTemplateColumns: '48px 2fr 1fr 1.5fr 1fr',
    bgcolor: colors.green,
    color: '#fff',
    px: 1,
    py: 1.25,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  tableRowBase: {
    display: 'grid',
    gridTemplateColumns: '48px 2fr 1fr 1.5fr 1fr',
    alignItems: 'center',
    px: 1,
    py: 1,
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:last-of-type': { borderBottom: 0 }
  },
  tableStatusText: { color: colors.green, fontWeight: 700 },
  tableAlreadyMappedText: { color: colors.green, fontWeight: 700 },
  tableEmptyState: { p: 3, textAlign: 'center' },
  tableSaveRow: { display: 'flex', justifyContent: 'flex-end', p: 2 }
}

// ** Single reusable table used for both "Total Active Accounts" (map side)
// and "Total Mapped Accounts" (unmap side). Behaviour differs purely via props.
const AccountMappingTable = ({
  icon,
  title,
  countLabel,
  countValue,
  toggleAllLabel,
  toggleAllChecked,
  toggleAllDisabled,
  onToggleAllChange,
  accounts,
  selectedIds,
  onSelectAccount,
  emptyMessage = 'No accounts to show.',
  alreadyMappedIds = [],
  saveButtonLabel,
  saveButtonIcon,
  onSave,
  saveDisabled,
  saveButtonVariant = 'contained',
  saveButtonColor = 'primary',
  saveButtonSx,
  mappedRowBg = 'transparent'
}: AccountMappingTableProps) => {
  const getRowSx = (isAlreadyMapped: boolean): SxProps<Theme> => ({
    ...(styles.tableRowBase as Record<string, unknown>),
    bgcolor: isAlreadyMapped ? mappedRowBg : 'transparent'
  })

  return (
    <Box sx={styles.tableContainer}>
      <Box sx={styles.tableHeaderRow}>
        <Box sx={styles.tableHeaderLeft}>
          <Box sx={styles.tableIconWrapper}>{icon}</Box>
          <Typography sx={styles.tableHeaderTitle}>{title}</Typography>
        </Box>

        <Box sx={styles.tableHeaderCountWrapper}>
          <Typography variant='caption' sx={styles.tableHeaderCountLabel}>
            {countLabel}
          </Typography>
          <Typography sx={styles.tableHeaderCountValue}>{countValue}</Typography>
        </Box>
      </Box>

      <Box sx={styles.tableToggleAllRow}>
        <Checkbox size='small' checked={toggleAllChecked} onChange={onToggleAllChange} disabled={toggleAllDisabled} />
        <Typography variant='body2'>{toggleAllLabel}</Typography>
      </Box>

      <Box sx={styles.tableScrollWrapper}>
        <Box sx={styles.tableMinWidthWrapper}>
          <Box sx={styles.tableGridHeader}>
            <Box />
            <Box>Account Number</Box>
            <Box>Currency</Box>
            <Box>Product Name</Box>
            <Box>Account Status</Box>
          </Box>

          {accounts.length === 0 ? (
            <Box sx={styles.tableEmptyState}>
              <Typography variant='body2' color='text.secondary'>
                {emptyMessage}
              </Typography>
            </Box>
          ) : (
            accounts.map(account => {
              const isAlreadyMapped = alreadyMappedIds.includes(account.id)

              return (
                <Box key={account.id} sx={getRowSx(isAlreadyMapped)}>
                  {isAlreadyMapped ? (
                    <Box />
                  ) : (
                    <Checkbox
                      size='small'
                      checked={selectedIds.includes(account.id)}
                      onChange={() => onSelectAccount(account.id)}
                    />
                  )}
                  <Typography variant='body2'>{account.accountNumber}</Typography>
                  <Typography variant='body2'>{account.currency}</Typography>
                  <Typography variant='body2'>{account.productName}</Typography>
                  {isAlreadyMapped ? (
                    <Typography variant='caption' sx={styles.tableAlreadyMappedText}>
                      Already Mapped
                    </Typography>
                  ) : (
                    <Typography variant='body2' sx={styles.tableStatusText}>
                      {account.status}
                    </Typography>
                  )}
                </Box>
              )
            })
          )}
        </Box>
      </Box>

      <Box sx={styles.tableSaveRow}>
        <Button
          variant={saveButtonVariant}
          size='small'
          color={saveButtonColor}
          startIcon={saveButtonIcon}
          onClick={onSave}
          disabled={saveDisabled}
          sx={saveButtonSx}
        >
          {saveButtonLabel}
        </Button>
      </Box>
    </Box>
  )
}

export default AccountMappingTable