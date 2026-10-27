import { useRouter } from 'next/router'
import { Box, Button, Typography } from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PaymentSuccessReceipt from
'src/@core/components/apps/payments/PaymentSuccessReceipt'
import useInternalFundTransfer from
'src/@core/hooks/apps/useInternalFundTransfer'

const FIXED_BANK = 'Bank AL Habib'

const Page = () => {
  const router = useRouter()

  const { review, confirmation, clearReview } = useInternalFundTransfer()

  const handleGoHome = () => {
    clearReview()
    router.push('/corporate-dashboard')
  }

  const handleNewTransfer = () => {
    clearReview()
    router.push('/Corporate-InnerPages/Payments/fund-transfer')
  }

  // Refresh ya direct URL par store khali hota hai
  if (!review || !confirmation) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems:
'center', justifyContent: 'center', py: 10, gap: 2 }}
      >
        <Typography variant='h6' color='text.secondary'>
          No transfer details found.
        </Typography>
        <Button variant='contained' onClick={handleNewTransfer}>
          Start a New Transfer
        </Button>
      </Box>
    )
  }

  const { draft, toAccountName } = review

  return (
    <PaymentSuccessReceipt
      headline='Transfer Successful'
      description='Your fund transfer has been submitted and is now being processed.'
      amountText={`${draft.currency.toUpperCase()}
${Number(draft.amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`}
      amountSubtext={
        <>
          sent to <strong>{toAccountName}</strong>
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
              icon: <AccountBalanceIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Account',
              value: draft.fromAccount
            }
          ]
        },
        {
          title: 'Beneficiary',
          rows: [
            {
              icon: <AccountBalanceIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Bank Name',
              value: FIXED_BANK
            },
            {
              icon: <CreditCardIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Account Number',
              value: draft.toAccount
            },
            {
              icon: <PersonOutlineIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Beneficiary Name',
              value: toAccountName
            }
          ]
        },
        {
          title: 'Transaction Details',
          rows: [
            {
              icon: <ReceiptLongIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Payment ID',
              value: confirmation.paymentId
            },
            {
              icon: <ReceiptLongIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Reference No',
              value: confirmation.referenceNo
            },
            {
              icon: <ReceiptLongIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'External Reference No',
              value: confirmation.externalReferenceNo
            },
            {
              icon: <ReceiptLongIcon sx={{ fontSize: 16, color:
'text.secondary' }} />,
              label: 'Purpose',
              value: draft.purpose
            }
          ]
        }
      ]}
    />
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'domestic-payments-funds-transfer-payment-recipt-page' }

export default Page