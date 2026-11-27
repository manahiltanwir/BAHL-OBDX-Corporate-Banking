import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PaymentSuccessReceipt from 'src/@core/components/apps/payments/PaymentSuccessReceipt'
import { countryOptions } from 'src/@core/utils/ofttPayment'

interface SinglePaymentForm {
  transferFrom: string
  transferFromLabel?: string
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
  // Review page se API response ke baad aate hain
  referenceNo?: string
  paymentId?: string
  paymentStatus?: string
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

const countryLabels: Record<string, string> = Object.fromEntries(countryOptions.map(option => [option.value, option.label]))

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
    router.push('/corporate-dashboard')
  }

  const handleNewTransfer = () => {
    router.push('/Corporate-InnerPages/International-Payments/single-payment')
  }

  if (!form) return null

  // Reference / Payment ID tab hi dikhaye jab API ne diye hon
  const paymentDetailRows = [
    form.referenceNo ? { label: 'Reference No', value: form.referenceNo } : null,
    form.paymentId ? { label: 'Payment ID', value: form.paymentId } : null,
    form.paymentStatus ? { label: 'Status', value: form.paymentStatus } : null
  ].filter(Boolean) as { label: string; value: string }[]

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
        ...(paymentDetailRows.length > 0 ? [{ title: 'Payment Details', rows: paymentDetailRows }] : []),
        {
          title: 'Transfer From',
          rows: [
            {
              icon: <AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
              label: 'Account',
              value: form.transferFromLabel || form.transferFrom
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
  subject: 'international-payments-single-payment-success-page'
}

export default Page
