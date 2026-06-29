// ** React Imports
import { Fragment, useState, useEffect, useMemo } from 'react'

// ** libs
import axios from 'axios'
import _ from 'lodash'

// ** MUI Imports
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone, DropzoneOptions } from 'react-dropzone'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { CardMedia } from '@mui/material'

interface FileProp {
  source: string
  type: 'image' | 'video' | 'doc'
  bytes: number
}

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

// ** types
interface IFileUploader extends DropzoneOptions {
  onUpload: (file: FileProp) => void
  existFile: FileProp
}

const FileUploaderRestrictions = ({
  maxFiles = 1,
  maxSize = 2000000,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
  onUpload,
  existFile,
  ...props
}: IFileUploader) => {
  // ** State
  const [file, setFile] = useState<FileProp | {}>({})
  const [status, setStatus] = useState<'idle' | 'pending' | 'succes' | 'error'>('idle')

  useMemo(() => {
    if (existFile.source) {
      setFile({ source: existFile.source, type: existFile.type })
    }
  }, [existFile])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize,
    accept,
    onDrop: (acceptedFiles: File[]) => {
      handleUpload(Object.assign(acceptedFiles[0]))
    },
    onDropRejected: () => {
      toast.error(`You can only upload ${maxFiles} file & maximum size of ${maxSize} MB.`, {
        duration: 2000
      })
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file && existFile.type === 'image') {
      return <img width={'100%'} height={'auto'} alt={'report image'} src={file.source} />
    } else if (file && existFile.type === 'video') {
      return (
        <CardMedia component='video' image={file.source} autoPlay width={'100%'} height={'auto'} controls />
        // <video width={"100%"} height={"auto"} controls>
        //   <source src={file.source} />
        // </video>
      )
    } else if (file && existFile.type === 'doc') {
      return <iframe width={'100%'} height={'auto'} src={file.source} title={'Report Doc'}></iframe>
    } else {
      ;('Invalid File')
    }
  }

  const FileView = ({ file }: { file: FileProp }) => (
    <ListItem>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        {file.bytes && (
          <div>
            <Typography className='file-size' variant='body2'>
              {Math.round(file.bytes / 100) / 10 > 1000
                ? `${(Math.round(file.bytes / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file.bytes / 100) / 10).toFixed(1)} kb`}
            </Typography>
          </div>
        )}
      </div>
    </ListItem>
  )

  // useEffect(
  //   () => () => {
  //     Make sure to revoke the data uris to avoid memory leaks
  //     file.forEach((file) => URL.revokeObjectURL(file.preview));
  //   },
  //   [file]
  // );

  const handleUpload = (file: File) => {
    setStatus('pending')
    const uploadURL: string = 'https://api.cloudinary.com/v1_1/dh4lnup4h/auto/upload'
    const uploadPreset: string = 'dtztq65u' // 'mfcn3oqs';

    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      axios({
        url: uploadURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      })
        .then(res => {
          setFile({ source: res.data.secure_url, ...res.data })
          onUpload({ source: res.data.secure_url, ...res.data })
          toast.success('uploaded!')
        })
        .catch(err => toast.error('upload field!'))
        .finally(() => setStatus('idle'))
    }
  }

  return (
    <DropzoneWrapper>
      {_.isEmpty(file) && (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
              <HeadingTypography variant='h6'>Drop file here or click to upload.</HeadingTypography>
              <Typography color='textSecondary'>
                Allowed {accept[Object.keys(accept)[0]].map(acc => '*' + acc + ', ')}
              </Typography>
              <Typography color='textSecondary'>
                Max {maxFiles} file and max size of {maxSize} MB
              </Typography>
            </Box>
          </Box>
        </div>
      )}
      {/* @ts-ignore */}
      {!_.isEmpty(file) && <FileView file={file} />}
    </DropzoneWrapper>
  )
}

export default FileUploaderRestrictions
