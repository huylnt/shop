import { useState, useEffect, useLayoutEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import moment from 'moment/moment'
import { getYearStartDateAndEndDate, getMonthStartDateAndEndDate, getWeekStartDateAndEndDate, convertToLocaleDateString, convertToValidDateFormat } from 'valueConverter'

import { Flex, Button, Box, Text, Tabs, TabList, TabPanel, Tab, TabPanels, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Input } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

import ContentLoader from 'component/ContentLoader'

const DateRangePicker = ({ setMode, setOpened, setStartDate, setEndDate }) => {
  const handleDateRangeChosen = () => {
    setStartDate(prev => convertToValidDateFormat(prev))
    setEndDate(prev => convertToValidDateFormat(prev))
    setMode('DATE_RANGE')
    setOpened(false)
  }

  return (
    <Modal onClose={() => setOpened(false)} isOpen={true} isCentered borderRadius='12px'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg='secondary' color='white' borderRadius='6px'>Pick date range</ModalHeader>

        <ModalBody marginTop='20px'>
          <Input type='date' onChange={(event) => setStartDate(event.target.value)} focusBorderColor='secondary' marginBottom='20px' />
          <Input type='date' onChange={(event) => setEndDate(event.target.value)} focusBorderColor='secondary' />
        </ModalBody>

        <ModalFooter gap='10px'>
          <Button variant='solid' colorScheme='pink' onClick={handleDateRangeChosen}>Proceed</Button>
          <Button variant='outline' colorScheme='pink' onClick={() => setOpened(false)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const FinanceReport = () => {
  const [_, setRefresher] = useState(0)
  const [mode, setMode] = useState('THIS_WEEK')
  const [dateRangePickerOpened, setDateRangePickerOpened] = useState(false)
  const [statefulStartDate, setStatefulStartDate] = useState()
  const [statefulEndDate, setStatefulEndDate] = useState()
  const [startDateRange, setStartDateRange] = useState()
  const [endDateRange, setEndDateRange] = useState()

  const toast = useToast()

  const [incomeChartOptions, setIncomeChartOptions] = useState({
    stroke: {
      width: 5
    },
    labels: [],
    colors: ['#f4365f', '#833e8d'],
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '10%',
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      }
    },
    dataLabels: {
      enabled: true,
      borderRadius: 50,
      formatter: function (val) {
        return val + ' VND';
      },
      offsetY: 5,
    },
  })

  const [incomeChartSeries, setIncomeChartSeries] = useState([
    {
      name: 'Revenue',
      type: 'column',
      data: []
    },
    {
      name: 'Profit',
      type: 'line',
      data: []
    }
  ])

  const [soldProductChartOptions, setSoldProductChartOptions] = useState({
    stroke: {
      width: 5
    },
    labels: [],
    colors: ['#f4365f', '#2795b0'],
    xaxis: {
      labels: {
        formatter: function (value, timestamp) {
          var tomorrow = moment(value)
          return convertToLocaleDateString(new Date(tomorrow))
        },
      },
      type: 'datetime'
    },
    yaxis: {
      type: 'numeric'
    },
  })

  const [soldProductSeries, setSoldProductSeries] = useState([
    {
      name: 'Sold products',
      type: 'line',
      data: []
    }
  ])

  const fetchIncomeStatistic = async (startDate, endDate) => {
    incomeChartOptions.labels.length = 0
    incomeChartSeries[0].data.length = 0
    incomeChartSeries[1].data.length = 0

    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Statistic').concat('/Revenue'), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      },
      body: JSON.stringify({ startDate, endDate })
    })
    const content = await response.json()

    if (content.length < 1) {
      incomeChartOptions.labels.push(convertToLocaleDateString(new Date()))
      incomeChartSeries[0].data.push(0)
      incomeChartSeries[1].data.push(0)
    }

    else content.forEach(e => {
      incomeChartOptions.labels.push(e.groupby.group)
      incomeChartSeries[0].data.push(e.dailyRevenue)
      incomeChartSeries[1].data.push(e.dailyProfit)
    })

    setRefresher(prev => prev + 1)
  }

  const fetchSoldProductStatistic = async (startDate, endDate) => {
    soldProductChartOptions.labels.length = 0
    soldProductSeries[0].data.length = 0

    const response = await fetch(process.env.REACT_APP_BACKEND_URL.concat('/Statistic').concat('/SoldProduct'), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': process.env.REACT_APP_API_KEY_FOR_SERVER
      },
      body: JSON.stringify({ startDate, endDate })
    })
    const content = await response.json()

    if (content.length < 1) {
      soldProductChartOptions.labels.push(convertToLocaleDateString(new Date()))
      soldProductSeries[0].data.push(0)
    }
    
    else content.forEach(e => {
      soldProductChartOptions.labels.push(e.groupby.group)
      soldProductSeries[0].data.push(e.dailySoldProducts)
    })

    setRefresher(prev => prev + 1)

    toast({
      title: 'Chart has been successfully re-sketched...',
      variant: 'subtle',
      status: 'info',
      position: 'bottom-right',
      colorScheme: 'purple'
    })
    setTimeout(() => toast.closeAll(), 1000)
  }

  useLayoutEffect(() => {
    toast({
      title: 'Changing date range...',
      variant: 'subtle',
      status: 'info',
      position: 'bottom-right',
      colorScheme: 'pink'
    })

    let startDate, endDate

    if (mode === 'DATE_RANGE') {
      startDate = startDateRange
      endDate = endDateRange
    }

    else if (mode === 'THIS_WEEK') {
      const currentWeek = getWeekStartDateAndEndDate()
      startDate = currentWeek.startDate
      endDate = currentWeek.endDate
    }

    else if (mode === 'THIS_MONTH') {
      const currentMonth = getMonthStartDateAndEndDate()
      startDate = currentMonth.startDate
      endDate = currentMonth.endDate
    }

    else if (mode === 'THIS_YEAR') {
      const currentYear = getYearStartDateAndEndDate()
      startDate = currentYear.startDate
      endDate = currentYear.endDate
    }

    setStatefulStartDate(startDate)
    setStatefulEndDate(endDate)
    fetchIncomeStatistic(startDate, endDate)
    fetchSoldProductStatistic(startDate, endDate)
  }, [mode])

  return (
    <>
      <Flex flexFlow='row' gap='30px' justify='flex-start' align='center' marginBottom='30px'>
        <Flex flexFlow='column' gap='3px' marginRight='50px'>
          <Flex gap='10px' align='baseline' justify='flex-start'>
            <Text>Start date</Text>
            <Text fontFamily='Alkatra'>{convertToLocaleDateString(statefulStartDate)}</Text>
          </Flex>

          <Flex gap='10px' align='baseline' justify='flex-start'>
            <Text>End date</Text>
            <Text fontFamily='Alkatra'>{convertToLocaleDateString(statefulEndDate)}</Text>
          </Flex>
        </Flex>

        {(mode === 'DATE_RANGE') ? <Button colorScheme='pink' variant='solid'>By date range</Button> : <Button colorScheme='pink' variant='outline' onClick={() => setDateRangePickerOpened(true)}>By date range</Button>}
        {(mode === 'THIS_WEEK') ? <Button colorScheme='pink' variant='solid'>This week</Button> : <Button colorScheme='pink' variant='outline' onClick={() => setMode('THIS_WEEK')}>This week</Button>}
        {(mode === 'THIS_MONTH') ? <Button colorScheme='pink' variant='solid'>This month</Button> : <Button colorScheme='pink' variant='outline' onClick={() => setMode('THIS_MONTH')}>This month</Button>}
        {(mode === 'THIS_YEAR') ? <Button colorScheme='pink' variant='solid'>This year</Button> : <Button colorScheme='pink' variant='outline' onClick={() => setMode('THIS_YEAR')}>This year</Button>}
      </Flex>

      <Tabs variant='soft-rounded' colorScheme='pink' size='lg' defaultIndex={0}>
        <TabList>
          <Tab>Income</Tab>
          <Tab>Sold products</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {(incomeChartSeries[0].data.length < 1) ? <ContentLoader /> : <ReactApexChart options={incomeChartOptions} series={incomeChartSeries} height={350} />}
          </TabPanel>

          <TabPanel>
            {(soldProductSeries[0].data.length < 1) ? <ContentLoader /> : <ReactApexChart options={soldProductChartOptions} series={soldProductSeries} height={350} />}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {dateRangePickerOpened && <DateRangePicker setMode={setMode} setOpened={setDateRangePickerOpened} setStartDate={setStartDateRange} setEndDate={setEndDateRange} />}
    </>
  )
}

export default FinanceReport