import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack';
import PhoneIcon from '@mui/icons-material/Phone';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import TextField from '@mui/material/TextField'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { toast } from 'react-hot-toast'
import Pagination from '@mui/material/Pagination';

const OurVendor = () => {
  const [value, setValue] = useState(0)
  const [vendors, setVendors] = useState([])
  const [companies, setCompanies] = useState([])
  const [categories, setCategories] = useState([])
  const [scroll, setScroll] = useState('paper')
  const [data, setData] = useState([])
  const [company, setCompany] = useState([])
  const [original, setOriginal] = useState([])
  const [searchText, setSearchText] = useState(null)
  const [recordsPerPage, setRecordsPerPage] = useState(6)
  const [currentPage, setCurrentPage] = useState(1);
  const [slicedData, setSlicedData] = useState([])
  const [viewDetailModalOpen, setViewDetailModalOpen] = useState(false)
  const descriptionElementRef = useRef(null)
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  

  
  
  const loadData = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/vendors`, {
      headers: {
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    }).then(response=>{
      setVendors(response.data.vendors);
      setCompanies(response.data.companies);
      setCategories(response.data.categories);
      setData(response.data.companies);
      setOriginal(response.data.companies);

      onPageChange(currentPage, response.data.companies)
    }).catch(error => {
      toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
      if (error.response && error.response.status == 401) {
        auth.logout();
      }
    })
  }
  useEffect(()=>{
    loadData()
  }, [])

  const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0)
  const [images, setImages] = useState([])
  const [vendorDetails, setVendorDetails] = useState([])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleChange = (event, newValue) => {
    setSearchText('')
    if(searchText){
      console.log(searchText)
      searchVendors(searchText)
    }
    setValue(newValue)
    if(newValue == 0){
      setData(companies)
    }else{
      let filter = categories.filter(c=>c.catogory==newValue)
      let data = [];
      filter.forEach(f=>{
        companies.map((c)=>{
          f.poc_userid == c.user_id && data.push(c)
        })
      })
      setData(data)
    }
  }

  const viewDetails = (id) => {
    let company = companies.filter(c=>c.id == id)
    let files = company[0].file
    setImages(files)
    setMaxSteps(files.length)
    setCompany(company[0])
    let vendor = company[0]
    let listings = categories.filter(ct => vendor.user_id == ct.poc_userid)
    let temp = listings.map((l, key) => {
      let obj = {}
      vendors.map(v => {
        if(v.id == l.catogory){
          obj.category = v.service_name
        }
      })
      obj.title = l.title 
      obj.description = l.description
      return {...obj, key: key}
    })
    setVendorDetails(temp)
    setViewDetailModalOpen(true)
    
  }
  const handleClose = () => {
    setViewDetailModalOpen(false)
  }

  const searchVendors = (search) => {
    setSearchText(search)
    let filteredData = []
    if(!search){
      filteredData = original
      setData(original)
      setCompanies(original)
    }else{
      filteredData = original.filter(item => {
        return Object.values(item).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    

    if(value == 0){
      setCompanies(filteredData)
      setData(filteredData)
    }else{
      let filter = categories.filter(c=>c.catogory==value)
      let data = [];
      filter.forEach(f=>{
        filteredData.map((c)=>{
          f.poc_userid == c.user_id && data.push(c)
        })
      })
      setData(data)
    }
  }

  const connectWhatsapp = () => {
    window.open(`https://wa.me/${company?.telephone}`);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const onPageChange = (page, original_data=[]) => {
    setCurrentPage(page);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    let org = original_data.length?original_data:original
    const currentVendors = org.slice(startIndex, endIndex);
    console.log(currentVendors)
    setSlicedData(currentVendors)
  };

  return (
    <>
      <Typography variant='h5'>Vendor List</Typography>
        <Grid sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
              <TextField
                id="filled-search"
                label="Search"
                type="search"
                variant="filled"
                value={searchText}
                onChange={e => searchVendors(e.target.value)}
              />
        </Grid>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label='All' value={0} />
              {vendors.map(v=><Tab label={v.service_name} value={v.id} />)}
            </TabList>
          </Box>
          <TabPanel value={0}>
            <h4>All Vendors List</h4>
            <Grid container spacing={2} className='match-height'>
              {slicedData.map(c=>{
                return (
                  <Grid item xs={12} md={4}>
                    <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                        <CardContent sx={{ display: 'flex' }}>
                          <Grid item xs={12} md={6}>
                            {/* <Avatar
                             alt={c.first_name}
                              src={c.file[0]}
                              sx={{ width: 56, height: 56 }}
                            /> */}
                            <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                              <AutoPlaySwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={activeStep}
                                onChangeIndex={handleStepChange}
                                enableMouseEvents
                              >
                                {c.file.map((step, index) => (
                                  <div key={step}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                      <Box
                                        component="img"
                                        sx={{
                                          height: 100,
                                          display: 'block',
                                          maxWidth: 300,
                                          overflow: 'hidden',
                                          width: '100%',
                                          mr: 2
                                        }}
                                        src={step}
                                        alt={step}
                                      />
                                    ) : null}
                                  </div>
                                ))}
                              </AutoPlaySwipeableViews>
                              <MobileStepper
                                steps={c.file.length}
                                position="static"
                                activeStep={activeStep}
                                nextButton={
                                  <Button
                                    size="small"
                                    onClick={handleNext}
                                    disabled={activeStep === c.file.length - 1}
                                  >
                                    {theme.direction === 'rtl' ? (
                                      <KeyboardArrowLeft />
                                    ) : (
                                      <KeyboardArrowRight />
                                    )}
                                  </Button>
                                }
                                backButton={
                                  <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                      <KeyboardArrowRight />
                                    ) : (
                                      <KeyboardArrowLeft />
                                    )}
                                  </Button>
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                          <Typography
                            component='div'
                            variant='p'
                            sx={{
                              fontWeight: 'bold',
                              mb: 10,
                              display: 'flex',
                              justifyContent: 'space-between',
                              flexDirection: 'column',
                              height:'50%'
                            }}
                          >
                            <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                              <span>ID</span>
                              <span>{c.user_id}</span>
                            </Typography>
                            <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                              <span>Name</span>
                              <span>{c.first_name}</span>
                            </Typography>
                            <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                              <span>Number</span>
                              <span>{c.telephone}</span>
                            </Typography>
                            
                          </Typography>
                          </Grid>
                        
                        </CardContent>
                        <Grid item xs={12}  sx={{px:5,width:'100%'}}>
                        <Typography sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between' }} spacing={5}>
                              <Button variant="outlined" onClick={() => window.open(c.location, '_blank')}>View Locations</Button>
                              <Button variant="contained" onClick={() => viewDetails(c.id)}>View Details</Button>
                            </Typography>
                          </Grid>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
            <Stack spacing={2} sx={{p:10}}>
              <Pagination count={Math.ceil(companies.length / recordsPerPage)}
                page={currentPage}
                onChange={handlePageChange}  color="secondary" />
            </Stack>
          </TabPanel>
          {vendors.map(v=>{
            return (
              <TabPanel value={v.id}>
                <h4>{v.service_name} Vendors List</h4>
                <Grid container spacing={2} className='match-height'>
                  {
                    data.map(c=>{
                    return (
                      <Grid item xs={12} md={4}>
                        <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                            <CardContent sx={{ display: 'flex' }}>
                              <Grid item xs={12} md={6}>
                                {/* <Avatar
                                alt={c.first_name}
                                  src={c.file[0]}
                                  sx={{ width: 56, height: 56 }}
                                /> */}
                                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                                  
                                  <AutoPlaySwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={activeStep}
                                    onChangeIndex={handleStepChange}
                                    enableMouseEvents
                                  >
                                    {c.file.map((step, index) => (
                                      <div key={step}>
                                        {Math.abs(activeStep - index) <= 2 ? (
                                          <Box
                                            component="img"
                                            sx={{
                                              height: 100,
                                              display: 'block',
                                              maxWidth: 300,
                                              overflow: 'hidden',
                                              width: '100%',
                                              mr: 2
                                            }}
                                            src={step}
                                            alt={step}
                                          />
                                        ) : null}
                                      </div>
                                    ))}
                                  </AutoPlaySwipeableViews>
                                  <MobileStepper
                                    steps={c.file.length}
                                    position="static"
                                    activeStep={activeStep}
                                    nextButton={
                                      <Button
                                        size="small"
                                        onClick={handleNext}
                                        disabled={activeStep === c.file.length - 1}
                                      >
                                        {theme.direction === 'rtl' ? (
                                          <KeyboardArrowLeft />
                                        ) : (
                                          <KeyboardArrowRight />
                                        )}
                                      </Button>
                                    }
                                    backButton={
                                      <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                        {theme.direction === 'rtl' ? (
                                          <KeyboardArrowRight />
                                        ) : (
                                          <KeyboardArrowLeft />
                                        )}
                                      </Button>
                                    }
                                  />
                                </Box>

                              </Grid>
                              <Grid item xs={12} md={6}>
                              <Typography
                                component='div'
                                variant='p'
                                sx={{
                                  fontWeight: 'bold',
                                  mb: 10,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  flexDirection: 'column',
                                  height:'50%'
                                }}
                              >
                                <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                                  <span>ID</span>
                                  <span>{c.user_id}</span>
                                </Typography>
                                <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                                  <span>Name</span>
                                  <span>{c.first_name}</span>
                                </Typography>
                                <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                                  <span>Number</span>
                                  <span>{c.telephone}</span>
                                </Typography>
                                
                              </Typography>
                              </Grid>
                            
                            </CardContent>
                            <Grid item xs={12}  sx={{px:5,width:'100%'}}>
                            <Typography sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between' }}>
                                  <Button variant="outlined" spacing={5}  onClick={() => window.open(c.location, '_blank')}>View Locations</Button>
                                  <Button variant="contained" onClick={() => viewDetails(c.id)}>View Details</Button>
                                </Typography>
                              </Grid>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>

      <div>
        <Dialog
          open={viewDetailModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
          fullScreen
        >
          <DialogTitle id='scroll-dialog-title'>Vendor Details</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>

              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                    <Grid container>
                      <Grid item xs={8}>
                        <Stack direction="row" spacing={2}>
                          <Avatar alt={company?.first_name} src={company?.cmp_logo} />
                          <Typography variant='h5' sx={{ my: 8 }}>
                              {company?.first_name}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={2}>
                        <Button variant="outlined" onClick={() => window.location.href = `tel:${company?.telephone}`}>
                          <PhoneIcon />
                          <Typography variant='p'>
                              Phone Vendor
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button variant="outlined" color="success" onClick={connectWhatsapp}>
                          <WhatsAppIcon />
                          <Typography variant='p'>
                              Connect Whatsapp
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={15} sx={{mt: 10}}>
                      <Grid item xs={3}>
                        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                          <AutoPlaySwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                          >
                            {images.map((step, index) => (
                              <div key={step}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                  <Box
                                    component="img"
                                    sx={{
                                      height: 255,
                                      display: 'block',
                                      maxWidth: 400,
                                      overflow: 'hidden',
                                      width: '100%',
                                    }}
                                    src={step}
                                    alt={step}
                                  />
                                ) : null}
                              </div>
                            ))}
                          </AutoPlaySwipeableViews>
                          <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                              <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                              >
                                Next
                                {theme.direction === 'rtl' ? (
                                  <KeyboardArrowLeft />
                                ) : (
                                  <KeyboardArrowRight />
                                )}
                              </Button>
                            }
                            backButton={
                              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? (
                                  <KeyboardArrowRight />
                                ) : (
                                  <KeyboardArrowLeft />
                                )}
                                Back
                              </Button>
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={9}>
                        <Grid item xs={12} >
                          <TextField
                            xs={6}
                            fullWidth
                            label='Address'
                            placeholder='Address'
                            aria-readonly={true}
                            value={company?.address}
                          />
                        </Grid>
                        <Grid container spacing={1} sx={{mt:5}}>
                          <Grid item xs={4} md={4} lg={4} >
                            <TextField
                              xs={6}
                              fullWidth
                              label='City'
                              placeholder='City'
                              aria-readonly={true}
                              value={company?.city}
                            />
                          </Grid>
                          <Grid item xs={4} md={4} lg={4} >
                            <TextField
                              xs={6}
                              fullWidth
                              label='State'
                              placeholder='State'
                              aria-readonly={true}
                              value={company?.state}
                            />
                          </Grid>
                          <Grid item xs={4} md={4} lg={4} >
                            <TextField
                              xs={6}
                              fullWidth
                              label='Country'
                              placeholder='Country'
                              aria-readonly={true}
                              value={company?.country}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={1} sx={{mt:5}}>
                          <Grid item xs={4} md={4} lg={4} >
                            <TextField
                              xs={6}
                              fullWidth
                              label='Telephone'
                              placeholder='Telephone'
                              aria-readonly={true}
                              value={company?.telephone}
                            />
                          </Grid>
                          <Grid item xs={8} md={8} lg={8} >
                            <TextField
                              xs={6}
                              fullWidth
                              label='Landmark'
                              placeholder='Landmark'
                              aria-readonly={true}
                              value={company?.lendmark}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{mt:5}}>
                          <Grid item lg={12} >
                            <Box sx={{ border: '1px dashed grey' }}>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {company?.description}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={15} sx={{mt: 10}}>
                      <Grid item lg={12} >
                        {vendorDetails.length > 0?
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                          {vendorDetails.map(v => (
                              <ListItem alignItems="flex-start">
                                <ListItemText
                                  primary={v?.category}
                                  secondary={
                                    <>
                                      <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        {v?.title}
                                      </Typography>
                                      {v?.description}
                                    </>
                                  }
                                />
                              </ListItem>
                          ))}
                          <Divider variant="inset" component="li" />
                        </List>:''}
                      </Grid>
                    </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default OurVendor
