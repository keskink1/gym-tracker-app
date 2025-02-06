import { Button } from '@mui/material'

const BackButton = (props: { onClick: () => void }) => {
  return (
    <Button size='small' variant='text' sx={{ color: 'unset' }} onClick={props.onClick}>
      Go back
    </Button>
  )
}

export default BackButton
