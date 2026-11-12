import { Grid, Alert } from '@mui/material'
import { usePartyManagement } from 'src/@core/hooks/apps/usePartyManagement'
import { PartyManagementForm } from 'src/types/apps/partyManagement'
import { StyledPanelCard } from 'src/@core/components/apps/party-management/components/styled-components'
import HeaderDescription from 'src/@core/components/apps/party-management/components/HeaderDescription'
import Form from 'src/@core/components/apps/party-management/components/Form'
import PartySpecifications from 'src/@core/components/apps/party-management/components/PartySpecifications'
import PartyDetails from 'src/@core/components/apps/party-management/components/PartyDetails'
import PartyOperationalStatus from 'src/@core/components/apps/party-management/components/PartyOperationalStatus'

const PartyManagement = () => {
  const {
    getParty,
    store,
    showResults,
    statusEnabled,
    setStatusEnabled,
    isCreatingNew,
    isEditing,
    form: { control, handleSubmit },
    handleSavePreferences,
    handleBack,
    handleCancelEdit,
    handleEdit
  } = usePartyManagement(null)

  const onSubmit = (data: PartyManagementForm) => {
    getParty(data.partyId)
  }

  const alreadyExist = !!store.entity?.alreadyExist
  const hasData = !!(store.entity as any)?.partyId
  const isLoading = store.status === 'pending'

  return (
    <Grid container spacing={6}>
      <HeaderDescription />
      <Form control={control} handleSubmit={handleSubmit} onSubmit={onSubmit} />

      {showResults && !isLoading && !hasData && store.message && (
        <Grid item xs={12}>
          <Alert severity='error'>{store.message}</Alert>
        </Grid>
      )}

      {showResults && !isLoading && hasData && (
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <StyledPanelCard>
                {!isEditing ? (
                  <PartySpecifications
                    isCreatingNew={isCreatingNew}
                    handleEdit={handleEdit}
                    handleSavePreferences={handleSavePreferences}
                  />
                ) : (
                  <PartyDetails
                    handleSavePreferences={handleSavePreferences}
                    handleCancelEdit={handleCancelEdit}
                    handleBack={handleBack}
                  />
                )}
              </StyledPanelCard>
            </Grid>
            <PartyOperationalStatus
              statusEnabled={statusEnabled}
              setStatusEnabled={setStatusEnabled}
              isEditing={isEditing}
              alreadyExist={alreadyExist}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

PartyManagement.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-party-management-page'
}

export default PartyManagement