import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PublicIcon from '@mui/icons-material/Public'
import PaymentSuccessReceipt from 'src/@core/components/apps/payments/PaymentSuccessReceipt'
import type { ReceiptRow } from 'src/@core/components/apps/payments/PaymentSuccessReceipt'

interface FtSuccessData {
  type: 'ft'
  bank: string
  accountNumber: string
  name: string
  nickname?: string
}

interface OfttSuccessData {
  type: 'oftt'
  bank: string
  accountNumber: string
  name: string
  country: string
  purpose: string
  relationship: string
  townName: string
  streetName: string
  countrySubdivision: string
  nickname?: string
}

type SuccessData = FtSuccessData | OfttSuccessData

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

const purposeLabels: Record<string, string> = {
  'family-support': 'Family Maintenance / Support',
  education: 'Education',
  medical: 'Medical Treatment',
  business: 'Business Payment',
  gift: 'Gift',
  other: 'Other'
}

const relationshipLabels: Record<string, string> = {
  brother: 'Brother',
  sister: 'Sister',
  father: 'Father',
  mother: 'Mother',
  son: 'Son',
  daughter: 'Daughter',
  spouse: 'Spouse',
  friend: 'Friend',
  'business-partner': 'Business Partner',
  other: 'Other'
}

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const [data, setData] = useState<SuccessData | null>(null)
  const returnTo = typeof router.query.returnTo === 'string' ? router.query.returnTo : undefined

  useEffect(() => {
    if (!router.isReady) return

    const { data: raw } = router.query

    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw)) as SuccessData
        setData(parsed)
      } catch {
        setData(null)
      }
    }
  }, [router.isReady, router.query])

  const handleGoHome = () => {
    router.push(returnTo ?? '/dashboard')
  }

  const handleAddAnother = () => {
    if (!data) return

    router.push({
      pathname: '/Corporate-InnerPages/beneficiary-management/add-beneficiary',
      query: { type: data.type, ...(returnTo ? { returnTo } : {}) }
    })
  }

  if (!data) return null

  const bankLabel = data.type === 'oftt' ? bankLabels[data.bank] ?? data.bank : data.bank

  const beneficiaryRows: ReceiptRow[] = [
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
      label: 'Bank Name',
      value: bankLabel
    },
    { label: 'Account Number / IBAN', value: data.accountNumber },
    {
      icon: <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
      label: 'Beneficiary Name',
      value: data.name
    },
    ...(data.nickname ? [{ label: 'Nickname', value: data.nickname }] : [])
  ]

  const sections =
    data.type === 'ft'
      ? [{ title: 'Beneficiary', rows: beneficiaryRows }]
      : [
          { title: 'Beneficiary', rows: beneficiaryRows },
          {
            title: 'Address & Purpose',
            rows: [
              {
                icon: <PublicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
                label: 'Country',
                value: countryLabels[data.country] ?? data.country
              },
              { label: 'Town', value: data.townName },
              { label: 'Street', value: data.streetName },
              { label: 'Country Subdivision', value: data.countrySubdivision },
              { label: 'Purpose', value: purposeLabels[data.purpose] ?? data.purpose },
              { label: 'Relationship', value: relationshipLabels[data.relationship] ?? data.relationship }
            ]
          }
        ]

  return (
    <PaymentSuccessReceipt
      headline='Beneficiary Added Successfully'
      description={`${data.name} has been added to your beneficiary list and is ready for future transfers.`}
      onGoHome={handleGoHome}
      homeLabel='Go to Home'
      newActionLabel='Add Another Beneficiary'
      onNewAction={handleAddAnother}
      metaRows={[
        { label: 'Beneficiary Type', value: data.type === 'ft' ? 'Same-Bank (Fund Transfer)' : 'International (OFTT)' },
        { label: 'Status', value: 'Added' },
        { label: 'Date & Time', value: new Date().toLocaleString() }
      ]}
      sections={sections}
    />
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-beneficiary-success'
}

export default Page