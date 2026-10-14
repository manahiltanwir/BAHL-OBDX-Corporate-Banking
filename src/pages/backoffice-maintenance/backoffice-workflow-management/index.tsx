import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme } from '@mui/material/styles'
import { Box, Card, Grid, InputAdornment, TextField, Typography, Chip } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import LoadingButton from '@mui/lab/LoadingButton'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import { BackofficeWorkflowRecordApi } from 'src/types/apps/backofficeWorkflowManagement'
import { useBackofficeWorkflowSearch } from 'src/@core/hooks/apps/useBackofficeWorkflowManagement'

const ADD_ROUTE = '/backoffice-maintenance/backoffice-workflow-management/backoffice-add-workflow'

const approvalFlowLabels: Record<'sequential' | 'parallel', string> = {
  sequential: 'Sequential',
  parallel: 'Parallel'
}

const StyledSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2]
}))

const workflowResultsColumns: ResultsTableColumn[] = [
  { key: 'workflowcode', label: 'Workflow Code' },
  { key: 'workflowdescription', label: 'Workflow Description' },
  { key: 'approvalflow', label: 'Approval Flow' },
  { key: 'levels', label: 'Levels' }
]
const workflowResultsGridColumns = '1fr 1.5fr 1fr 0.6fr'

const deriveApprovalFlow = (wf: BackofficeWorkflowRecordApi): 'sequential' | 'parallel' => {
  const isParallel = wf.steps.length === 1 && wf.steps[0]?.routingType === 'PARALLEL'

  return isParallel ? 'parallel' : 'sequential'
}

const deriveLevelsCount = (wf: BackofficeWorkflowRecordApi): number => {
  return deriveApprovalFlow(wf) === 'parallel' ? wf.steps[0]?.approvers.length ?? 0 : wf.steps.length
}

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const [workflowCodeInput, setWorkflowCodeInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const { results, status, searchWorkflows } = useBackofficeWorkflowSearch()

  const handleSearch = async () => {
    await searchWorkflows(workflowCodeInput.trim())
    setHasSearched(true)
  }

  const handleRowClick = (wf: BackofficeWorkflowRecordApi) => {
    router.push(`${ADD_ROUTE}?id=${wf.id}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 200 }}>
            A centralized dashboard to create, update, and manage workflows.
          </Typography>
          <Link href={ADD_ROUTE}>
            <LoadingButton variant='contained' loadingPosition='end' startIcon={<PersonAddAltIcon />}>
              Create Workflow
            </LoadingButton>
          </Link>
        </Box>
      </Grid>

      {/* Search Engine */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography
            variant='caption'
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            Search With Workflow Code
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              fullWidth
              placeholder='Enter Workflow Code, or leave empty to view all...'
              value={workflowCodeInput}
              onChange={e => setWorkflowCodeInput(e.target.value)}
              onKeyDown={event => event.key === 'Enter' && handleSearch()}
              helperText=' '
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
            />
            <LoadingButton
              variant='contained'
              size='large'
              loadingPosition='end'
              loading={status === 'pending'}
              onClick={handleSearch}
              sx={{ height: 52, minWidth: 160, fontSize: 12 }}
            >
              Search Record
            </LoadingButton>
          </Box>
        </StyledSearchCard>
        {hasSearched && status !== 'pending' && (
          <ResultsTable
            columns={workflowResultsColumns}
            gridTemplateColumns={workflowResultsGridColumns}
            rows={results}
            getRowKey={wf => String(wf.id)}
            onRowClick={handleRowClick}
            emptyMessage='No workflows found. You can create a new one instead.'
            headerColor={theme.palette.primary.main}
            renderRow={wf => (
              <>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {wf.workflowCode}
                </Typography>
                <Typography variant='body2'>{wf.description}</Typography>
                <Box>
                  <Chip label={approvalFlowLabels[deriveApprovalFlow(wf)]} size='small' />
                </Box>
                <Typography variant='body2'>{deriveLevelsCount(wf)}</Typography>
              </>
            )}
          />
        )}
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'backoffice-maintenance-workflow-management-page'
}

export default Page