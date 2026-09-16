import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PaymentSuccessReceipt from 'src/@core/components/apps/payments/PaymentSuccessReceipt'

interface SinglePaymentForm {
  transferFrom: string
  beneficiaryMode: 'existing' | 'new'
  selectedBeneficiaryId: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  amount: string
  currency: string
  beneficiaryName: string
  country: string
  purpose: string
  relationship: string
  department: string
  subDepartment: string
  streetName: string
  buildingNumber: string
  buildingName: string
  floor: string
  postBox: string
  room: string
  postCode: string
  townName: string
  townLocationName: string
  districtName: string
  countrySubdivision: string
}

const transferFromAccounts: Record<string, string> = {
  'acc-001': '0110-1234567-001 (PKR Current Account)',
  'acc-002': '0110-7654321-002 (USD Current Account)'
}

const bankLabels: Record<string, string> = {
  hbl: 'HBL - Habib Bank Limited',
  ubl: 'UBL - United Bank Limited',
  mcb: 'MCB Bank',
  abl: 'Allied Bank Limited',
  meezan: 'Meezan Bank',
  bafl: 'Bank Alfalah',
  other: 'Other Bank'
}

const countryLabels: Record<string, string> = {
  pk: 'Pakistan',
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  uk: 'United Kingdom',
  us: 'United States'
}

const currencyLabels: Record<string, string> = {
  pkr: 'PKR',
  usd: 'USD',
  aed: 'AED',
  sar: 'SAR',
  gbp: 'GBP'
}

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState<SinglePaymentForm | null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const { data } = router.query

    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(decodeURIComponent(data)) as SinglePaymentForm
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
    router.push('/Corporate-InnerPages/International-Payments/single-payment')
  }

  if (!form) return null

  return (
    <PaymentSuccessReceipt
      headline='Transfer Successful'
      description='Your international payment has been submitted and is now being processed.'
      amountText={`${currencyLabels[form.currency] ?? form.currency} ${form.amount}`}
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
              value: bankLabels[form.beneficiaryBank] ?? form.beneficiaryBank
            },
            { label: 'Account Number / IBAN', value: form.beneficiaryAccountNumber },
            {
              icon: <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
              label: 'Beneficiary Name',
              value: form.beneficiaryName
            },
            { label: 'Country', value: countryLabels[form.country] ?? form.country }
          ]
        }
      ]}
    />
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'single-payment-success'
}

export default Page