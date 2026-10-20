import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** import custom hooks
import { RootState, AppDispatch } from 'src/store'

import { lcSchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
import { ImportLCFormState } from 'src/types/apps/lc'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
  fetchOneActionForBeneficiary,
  fetchOneActionForAdvisoryBank
} from 'src/store/apps/lc'
import { setFormValues } from 'src/@core/helper/setFormValues'
import { lcService } from 'src/services'
import toast from 'react-hot-toast'

const defaultValues: ImportLCFormState = {
  lcRefSeq: '',
  isDraft: 'N',
  status: 'SUBMITTED',
  partyId: '',
  userId: '',
  createdBy: '',
  updatedBy: '',

  // ---------------- Basic Information ----------------
  branch: 'Main Corporate Branch (Autofetched)',
  applicationDate: new Date().toISOString().slice(0, 10),
  accountNumber: '',
  accountTitle: '',
  expiryDate: '',
  placeOfExpiry: '',

  // ===== Applicant Details =====
  applicantName: '',
  applicantAddress: '',
  applicantPhone: '',
  applicantEmail: '',

  // ---------------- Beneficiary Details ----------------
  beneficiaryName: '',
  beneficiaryId: '', // FIX: Added missing property
  countryOfBeneficiary: '',
  beneficiaryFullAddress: '',
  telephoneNumber: '',
  emailAddress: '',

  // ---------------- Advising Bank Details ----------------
  advisingBankId: '', // FIX: Added missing property
  bankName: '',
  swiftCode: '',
  bicCode: '',
  bankFullAddress: '',
  bankTelephoneNumber: '',
  bankEmailAddress: '',

  // ===== Documentary Credit Details =====
  lcCurrency: 'USD',
  lcAmount: '',
  amountInWords: '',
  toleranceEnabled: false,
  tolerancePositive: '',
  toleranceNegative: '',

  // ---------------- Credit Tenor, Payment & Financial Instrumentation ----------------
  creditAvailableWith: '',
  lcTenorBasis: '',
  availabilityType: '',
  mixedPaymentDetails: '',
  usanceBasis: '',
  usanceDays: '',

  // ===== Incoterms & Shipment Routing =====
  incoterm: '',
  shipmentFrom: '',
  shipmentTo: '',
  modeOfShipment: '',
  partialShipment: 'Not Allowed',
  transshipment: 'Not Allowed',
  billOfExchange: 'No',
  drawnOnBank: '',
  forwardCover: 'No',
  tenorForwardContract: '',
  placeOfTakingInCharge: '',
  portOfLoading: '',
  portOfDischarge: '',
  placeOfFinalDestination: '',

  // ===== Description of Goods =====
  proformaInvoiceNo: '',
  proformaDate: '',
  goodsDescription: '',

  // ===== Documents Required & Transport Details =====
  docInvoiceToggle: false,
  invoiceOriginals: '',
  invoiceCopies: '',
  invoiceOrigin: '',
  docInsuranceToggle: false,
  docOriginToggle: false,
  originIssuer: '',
  docPackingToggle: false,
  packingOriginals: '',
  packingCopies: '',
  docBolToggle: false,
  docAwbToggle: false,
  docTruckReceiptToggle: false,
  docOthersInput: '',

  // ===== Additional Conditions and Specifications =====
  standardConditions: [],
  presentationDaysToggle: false,
  presentationDays: '',
  specialInstructions: '',
  confirmationToggle: false,
  confirmationInstruction: '',
  confChargesToggle: false,
  confirmationCharges: '',
  foreignChargesToggle: false,
  foreignBanksCharges: '',
  reimbursingChargesToggle: false,
  reimbursingBankCharges: '',
  discrepancyFeeToggle: false,
  discrepancyFee: '',
  otherSpecify: '',
  additionalConditions: '',
  attachments: [], // FIX: Double-check spelling inside interface matches this exactly
  termsAccepted: false
}

export const useLC = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.lc)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(lcSchema.add)
  })

  useEffect(() => {
    serviceId && dispatch(fetchOneAction({ id: serviceId }))
  }, [serviceId])

  // const HOF = <ObjKeys, ObjApi>(entity: ObjApi, setValue: (key: ObjKeys, value: string) => void) => { // {[key: string]: string}
  //   // @ts-ignore
  //   Object.keys(entity).forEach((key) => {
  //     // @ts-ignore
  //     setValue(key, value)
  //   })
  // }

  useMemo(() => {
    // if ('id' in store.entity && store.entity && serviceId) {
    //   // HOF<CategoryKeys, CategoryApi>(store.entity, (key, value) => {
    //   //   form.setValue(key, value)
    //   // })
    // //   setFormValues<CategoryKeys, CategoryApi>(store.entity, (key, value) => {
    // //     form.setValue(key, value)
    // //   })
    //   // // @ts-ignore // FIX_LATER
    //   // Object.keys(store.entity).forEach((key: CategoryKeys) => {
    //   //   `id` in store.entity && form.setValue(key, store.entity[key])
    //   // });
    // } else {
    //   form.reset()
    // }
  }, [store.entity, serviceId])

  const getLC = async (id: string) => {
    dispatch(fetchOneAction({ id }))
  }

  const getBeneficiariesForLC = async (partyId: string) => {
    dispatch(fetchOneActionForBeneficiary({ partyId }))
  }

  const getAdvisoryBanksForLC = async (partyId: string) => {
    dispatch(fetchOneActionForAdvisoryBank({ partyId }))
  }

  const getAllLCs = async ({ query }: GetParams) => {
    dispatch(fetchAllAction({ query }))
  }

  const addLC = async (data: ImportLCFormState, setSubmitted: Dispatch<SetStateAction<boolean>>) => {
    dispatch(addAction({ data }))
      .then(({ payload }: any) => {
        debugger
        if (payload.status === 'SUBMITTED') {
          toast.success('Letter Of Credit Created succesfully!', { duration: 5000 })
          setSubmitted(true)
        }else if (payload.status === 'DRAFT'){
            toast.success('Letter Of Credit Draft succesfully!', { duration: 5000 })
            setSubmitted(true)
        }
      })
      .catch(err => {
        setSubmitted(false)
      })
  }

  const updateLC = async (id: string, data: ImportLCFormState) => {
    dispatch(updateAction({ id, data }))
      .then(({ payload }: any) => {
        debugger
      })
      .catch(err => {
        debugger
      })
  }

  const deleteLC = async (id: string) => {
    dispatch(deleteAction({ id }))
      .then(({ payload }: any) => {
        debugger
      })
      .catch(err => {
        debugger
      })
  }

  const exportLCs = async () => {
    csvDownload('lc', store.entities)
  }

  return {
    form,
    store,
    getLC,
    getBeneficiariesForLC,
    getAdvisoryBanksForLC,
    getAllLCs,
    addLC,
    updateLC,
    deleteLC,
    exportLCs
  }
}
