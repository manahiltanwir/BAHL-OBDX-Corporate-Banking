import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Typography } from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PaymentSuccessReceipt from 'src/@core/components/apps/payments/PaymentSuccessReceipt'

interface FundTransferForm {
  transferFrom: string
  currency: string
  amount: string
  beneficiaryMode: 'existing' | 'new'
  selectedBeneficiaryId: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  beneficiaryName: string
}

const transferFromAccounts: Record<string, string> = {
  'acc-001': '0110-1234567-001 (USD Current Account)',
  'acc-002': '0110-4455667-002 (USD Savings Account)'
}

const currencyLabels: Record<string, string> = {
  usd: 'USD',
  pkr: 'PKR',
  aed: 'AED',
  sar: 'SAR',
  gbp: 'GBP'
}

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState<FundTransferForm | null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const { data } = router.query

    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(decodeURIComponent(data)) as FundTransferForm
        setForm(parsed)
      } catch {
        setForm(null)
      }
    }
  }, [router.isReady, router.query])

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  const handleNewTransfer = () => {
    router.push('/Corporate-InnerPages/Payments/fund-transfer')
  }

  if (!form) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
        <Typography variant='h6' color='text.secondary'>
          No transfer details found.
        </Typography>
        <Button variant='contained' onClick={() => router.push('/Corporate-InnerPages/Payments/fund-transfer')}>
          Start a New Transfer
        </Button>
      </Box>
    )
  }

  return (
    <PaymentSuccessReceipt
      headline='Transfer Successful'
      description='Your fund transfer has been submitted and is now being processed.'
      amountText={`${currencyLabels[form.currency] ?? form.currency.toUpperCase()} ${Number(form.amount).toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      )}`}
      amountSubtext={
        <>
          sent to <strong>{form.beneficiaryName}</strong>
        </>
      }
      onGoHome={handleGoHome}
      newActionLabel='New Transfer'
      onNewAction={handleNewTransfer}
      sections={[
        {
          title: 'Transfer From',
          rows: [
            {
              icon: <AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
              label: 'Account',
              value: transferFromAccounts[form.transferFrom] ?? form.transferFrom
            }
          ]
        },
        {
          title: 'Beneficiary',
          rows: [
            {
              icon: <AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
              label: 'Bank Name',
              value: form.beneficiaryBank
            },
            {
              icon: <CreditCardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
              label: 'Account Number',
              value: form.beneficiaryAccountNumber
            },
            {
              icon: <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
              label: 'Beneficiary Name',
              value: form.beneficiaryName
            }
          ]
        }
      ]}
    />
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'payment-recipt' }

export default Page