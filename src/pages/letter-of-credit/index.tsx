import Header from 'src/layouts/components/LcForm/header'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Box from '@mui/material/Box'
import Sidebar from 'src/@core/components/form/Sidebar'
import React from 'react'
import SelectField from 'src/@core/components/form/Select'
import { useForm } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import Field from 'src/@core/components/form/InputField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LCRadioGroup from 'src/layouts/components/LcForm/lcradiogroup'
import LCRow, { LCRowItem } from 'src/layouts/components/LcForm/lcrow'
import LCSelectBox from 'src/layouts/components/LcForm/lcselectbox'
import LCText from 'src/layouts/components/LcForm/lctext'
import LCInputBox from 'src/layouts/components/LcForm/lcinputbox'
import LCActionButtons from 'src/layouts/components/LcForm/lcactionbuttons'
const styles = {
  sideBar: {
    width: 320,
    borderRight: '1px solid #E5E7EB'
  },
  formContent: {
    flex: 1,
    p: 4,
    overflowY: 'auto'
  },
 
}
const LetterOfCredit = () => {
  const applicantOptions = [
  { value: 'goodcare', label: 'GOODCARE PLC' },
  { value: 'abc', label: 'ABC Corporation' },
  { value: 'xyz', label: 'XYZ Industries' }
]
const accountOptions = [
  {
    label: 'Current Account',
    value: 'current'
  },
  {
    label: 'Savings Account',
    value: 'savings'
  }
]
const productOptions = [
  {
    label: 'Import Letter of Credit',
    value: 'importLC'
  },
  {
    label: 'Standby Letter of Credit',
    value: 'standbyLC'
  },
  {
    label: 'Back to Back Letter of Credit',
    value: 'backToBackLC'
  }
]
const [beneficiaryType, setBeneficiaryType] = React.useState('existing')
const [documentaryCredit, setDocumentaryCredit] = React.useState('transferable');
const [lcType,handleLcTypeChange]=React.useState('sight');
const [revolving, setRevolving] = React.useState('yes');
const [expiryDate, setExpiryDate] = React.useState<Dayjs | null>(dayjs())
const {
  control,
  handleSubmit
} = useForm({
  defaultValues: {
    applicantName: '',
    accountName: '',
    address: ''
  }
})
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <Box sx={styles.sideBar}>
          <Sidebar />
        </Box>

        {/* Form */}
        <Box sx={styles.formContent}>
        <LCText variant="title">
  LC Details
</LCText>
    <LCText variant="section">
  Applicant Details
</LCText>
<LCSelectBox
  control={control}
  name="applicantName"
  label="Applicant Name"
  options={applicantOptions}
/>
<LCInputBox
  control={control}
  name="address"
  label="Address"
  placeholder="Enter Address"
  type="text-area"
/>
<LCSelectBox
  control={control}
  name="accountName"
  label="Account Name"
  options={accountOptions}
/>
<LCText variant="swift">
  40A
</LCText>

<LCText variant="label">
  Type of Documentary Credit
</LCText>

<LCRadioGroup
  value={documentaryCredit}
  onChange={setDocumentaryCredit}
  options={[
    { label: 'Transferable', value: 'transferable' },
    { label: 'Non Transferable', value: 'nonTransferable' }
  ]}
/>
<LCText variant="label">
  LC Type
</LCText>
<LCRadioGroup
  value={lcType}
  onChange={handleLcTypeChange}
  options={[
    { label: 'Sight', value: 'sight' },
    { label: 'Usance', value: 'usance' },
    { label: 'Mixed Payment', value: 'mixedPayment' }
  ]}
/>
<LCText variant="label">
  Revolving
</LCText>
<LCRadioGroup
  value={revolving}
  onChange={setRevolving}
  options={[
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ]}
/>
<LCSelectBox
  control={control}
  name="product"
  label="Select Product"
  options={productOptions}
/>


{/* 31D */}
<LCText variant="swift">31D</LCText>

<LCRow>
  <LCRowItem>
    <LCText variant="label">
      Date of Expiry
    </LCText>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={expiryDate}
        onChange={(newValue) => {
          setExpiryDate(newValue)
        }}
        inputFormat="DD/MM/YYYY"
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',

                '& fieldset': {
                  borderColor: '#D6DCE5'
                },

                '&:hover fieldset': {
                  borderColor: '#D6DCE5'
                },

                '&.Mui-focused fieldset': {
                  borderColor: '#008E5A',
                  borderWidth: '2px'
                }
              },

              '& .MuiSvgIcon-root': {
                color: '#008E5A'
              },

              '& input': {
                fontSize: '15px'
              }
            }}
          />
        )}
      />
    </LocalizationProvider>
  </LCRowItem>

 <LCRowItem>
  <LCInputBox
    control={control}
    name="placeOfExpiry"
    label="Place of Expiry"
    placeholder="Enter Place"
    disableWrapper
  />
</LCRowItem>
</LCRow>
<LCText variant="swift">59</LCText>


<LCText variant="section">
  Beneficiary Details
</LCText>
<LCRadioGroup
  value={beneficiaryType}
  onChange={setBeneficiaryType}
  options={[
    { label: 'Existing', value: 'existing' },
    { label: 'New', value: 'new' }
  ]}
/>
<LCSelectBox
  control={control}
  name="beneficiaryName"
  label="Beneficiary Name"
  options={[
    { label: 'PKBANK31XXX', value: 'pkbank' },
    { label: 'HBL', value: 'hbl' },
    { label: 'MCB', value: 'mcb' }
  ]}
/>
<LCInputBox
  control={control}
  name="beneficiaryAddress"
  label="Address"
  placeholder="Enter Address"
  type="text-area"
/>
<LCText variant="swift">32B</LCText>
<LCRow>
  <LCRowItem>
    <SelectField
      control={control}
      name="currency"
      label="Currency"
      placeholder="Select Currency"
      options={[
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'PKR', value: 'PKR' }
      ]}
    />
  </LCRowItem>

  <LCRowItem>
    <Field
      control={control}
      name="lcAmount"
      label="LC Amount"
      placeholder="Enter LC Amount"
      type="number"
    />
  </LCRowItem>
</LCRow>

  

<LCText variant="label">
  Local Currency Equivalent
</LCText>
<LCText variant="label">
  LC Amount Tolerance
</LCText>
<LCRow>
  <LCRowItem>
    <Field
      control={control}
      name="underTolerance"
      placeholder="Under (%)"
      type="number"
    />
  </LCRowItem>

  <LCRowItem>
    <Field
      control={control}
      name="aboveTolerance"
      placeholder="Above (%)"
      type="number"
    />
  </LCRowItem>
</LCRow>
<LCText variant="label">
  Total Exposure
</LCText>

<LCText variant="value">
  GBP 11,000.00
</LCText>

<LCText variant="swift">
  39C
</LCText>
<LCInputBox
  control={control}
  name="additionalAmountCovered"
  placeholder="Additional Amount Covered"
  type="text-area"
/>

<LCInputBox
  control={control}
  name="customerReferenceNumber"
  placeholder="Customer Reference Number"
/>
<LCText variant="swift">
  41A
</LCText>

<LCSelectBox
  control={control}
  name="creditAvailableBy"
  label="Credit Available By"
  options={[
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Acceptance', value: 'acceptance' },
    { label: 'Deferred Payment', value: 'deferredPayment' },
    { label: 'Sight Payment', value: 'sightPayment' }
  ]}
/>
<LCText variant="swift">
  42P
</LCText>

<LCText variant="label">
  Negotiation / Deferred Payment Details
</LCText>

<LCInputBox
  control={control}
  name="deferredPaymentDetails"
  placeholder="Enter Details"
  type="text-area"
/>

<LCText variant="label">
  Credit Available With
</LCText>

<LCText variant="value">
  <>
    HDBANK65XXX
    <br />
    HDFC BANK
    <br />
    HDBANK65XXX
    <br />
    HDBANK65XXX
  </>
</LCText>

<Button variant="outlined" size="small" sx={{ mb: 4 }}>
  Reset
</Button>
<LCText variant="swift">
  42C
</LCText>

<TableContainer
  component={Paper}
  sx={{
    width: '100%',
    boxShadow: 'none',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    overflowX: 'auto',
    mb: 2
  }}
>
  <Table size="small">
    <TableHead>
      <TableRow>
        {['Tenor', 'Credit Days From', 'Drawee Bank', 'Draft Amount', 'Actions'].map(item => (
          <TableCell
            key={item}
            sx={{
              fontWeight: 700,
              color: '#1F2937',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {item}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      <TableRow>
        <TableCell>0</TableCell>
        <TableCell>10</TableCell>
        <TableCell>Demo</TableCell>
        <TableCell>GBP 100.00</TableCell>
        <TableCell>
          <DeleteOutlineIcon sx={{ color: '#008E5A', fontSize: 20, cursor: 'pointer' }} />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

<Button
  variant="text"
  sx={{
    color: '#008E5A',
    fontWeight: 600,
    textTransform: 'none',
    mb: 3,
    px: 0
  }}
>
  Add Another Draft
</Button>
<LCActionButtons
  onNext={() => console.log('Next')}
  onSave={() => console.log('Save')}
  onCancel={() => console.log('Cancel')}
/>
        </Box>
        
      </Box>
    </Box>
  )
}

LetterOfCredit.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LetterOfCredit.guestGuard = true

export default LetterOfCredit
