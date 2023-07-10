// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useAuth } from 'src/hooks/useAuth'

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 95
  }
}))

const Welcome = () => {
  const auth = useAuth()
  return (
    <Card component='div' sx={{ position: 'relative', minHeight: 150 ,width:'100%' }}>
      <CardContent>
        <Typography variant='h6'>
          Welcome{' hhhh'}
          <Box component='div' sx={{ fontWeight: 'bold' }}>
            dfgh
          </Box>

        </Typography>
        <TrophyImg alt='trophy' src='/images/cards/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default Welcome
