import {
  Box,
  Button,
  Flex, Grid, GridItem, Icon, IconButton, Image, Input, Link, Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {useEffect, useMemo, useState} from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
// Custom components
import Card from "components/card/Card";
import {MdCancel, MdCheckCircle, MdOutlineError} from "react-icons/md";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import config from "../../../../config.json";
import axios from 'axios';
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
function fetchRequestListingProcess(id) {
  return fetch(config.API_URL+"custom/"+id+"/listingProcess",
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Properties data:', data);
        return data;
      })
      .catch((error) => {
        console.error('Error fetching properties data:', error);
        throw error;
      });
}
function fetchPropertyByIdData(id) {
  return fetch(config.API_URL+"properties/"+id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Properties data:', data);
        return data;
      })
      .catch((error) => {
        console.error('Error fetching properties data:', error);
        throw error;
      });
}


export default function PropertiesTable(props) {
  const { columnsData, tableData, reloadParent } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 }, // Initial page and page size
      },
      useGlobalFilter,
      useSortBy,
      usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setGlobalFilter

  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const { globalFilter } = state;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [size, setSize] = React.useState('full')
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [propertyData, setPropertyData] = useState({});
  const [listingData, setListingData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBackgroundCheck, setSelectedBackgroundCheck] = useState("");
  const [selectedHouseInspection, setSelectHouseInspection] = useState("");
  const [selectedHouseValuation, setSelectedHouseValuation] = useState("");
  const [valuationAmount, setValuationAmount] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const options = [
    { value: 1, label: "Passed" },
    { value: -1, label: "Failed" },
  ];
  useEffect(() => {
    if (modalAction === 'details'|| modalAction==="update") {
      const fetchData = async () => {
        try {
          const data = await fetchPropertyByIdData(modalData.id);
          setPropertyData(data.data);
          setSelectedOption(propertyData.isVerified);
        } catch (error) {
          console.error('Error in component:', error);
        }
      };
      fetchData();
    }
    else if (modalAction === 'listing') {
      const fetchData = async () => {
        try {
          const data = await fetchRequestListingProcess(modalData.id);
          setListingData(data.data);
          console.log(listingData);
        } catch (error) {
          console.error('Error in component:', error);
        }
      };
      fetchData();
    }
  }, [modalAction, modalData,propertyData.isVerified]);
  const onOpen = (action, dataInput) => {
    setModalAction(action);
    setModalData(dataInput);
    if (action === 'update') {
      setSize('xl');
    }
    else {
      setSize('full');
    }
      setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setModalAction(null);
    setModalData(null);
    setSelectedOption(null);
    setPropertyData({});
    setListingData({});
    setSelectedBackgroundCheck("");
    setSelectHouseInspection("");
    setSelectedHouseValuation("");
    setValuationAmount("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if(name==="houseValuation") setValuationAmount(value);
    else if(name==="monthlyRent") setMonthlyRent(value);
  }

  const handleModalAction = async () => {
    if (modalAction === 'update') {
      console.log('Update action with data:', selectedOption);
      try {
        const jwtToken = localStorage.getItem("jwt");
        let prop = propertyData;
        prop.isVerified = selectedOption;
        await axios.patch(config.API_URL + `custom/` + propertyData.id+'/updateIsVerified', prop, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });
        console.log('Property updated successfully!');
        reloadParent();
      } catch (error) {
        console.error('Error updating property:', error);
      }
      onClose();
    }
    if(modalAction==='listing'){
      console.log('Listing action with data:', selectedBackgroundCheck,selectedHouseInspection,selectedHouseValuation);
      try {
        const jwtToken = localStorage.getItem("jwt");
        let prop ={
          backgroundCheckServiceId: listingData.backgroundCheck.serviceUsedId,
          isPassListingBackgroundCheck: selectedBackgroundCheck,
          propertyInspectionServiceId: listingData.houseInspection.serviceUsedId,
          isPassListingPropertyInspection: selectedHouseInspection,
          propertyValuationServiceId: listingData.houseValuation.serviceUsedId,
          isPassListingPropertyValuation: selectedHouseValuation,
          valuationAmount: valuationAmount,
          monthlyRent: monthlyRent,
        }
        const response = await axios.post(config.API_URL + `custom/` + listingData.propertyId+'/updateIsListed', prop, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });
        console.log('Listing updated successfully!');
        console.log(response.data);
        reloadParent();
      } catch (error) {
        console.error('Error updating listing:', error);
      }
      onClose();  
    }
  };


  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Grid templateColumns={{ sm: '1fr', md: '1fr', lg: '10fr 2fr' }} mb='20px'>
        {/* Left column */}
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Table Property
        </Text>

        <Flex justify='flex-end'>
          {/* Search input for global filtering */}
          <Input
              type='text'
              placeholder='Search...'
              fontSize={{ sm: "10px", lg: "12px" }}
              color='gray.400'
              fontWeight='700'
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Flex>
      </Grid>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  // Render the button for the 'actions' column
                  if (cell.column.id === 'actions') {
                    data = (
                    <Grid
                        templateColumns={{
                          base: "1fr",
                        }}
                        templateRows={{
                          base: "repeat(3, 1fr)",
                        }}
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Button onClick={() => onOpen('details', {id:row.original.id})} colorScheme="teal" size="sm" marginLeft="1">
                          Details
                        </Button>
                        <Modal isOpen={isOpen} size={size} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>{modalAction === 'details' ? 'Details Property' : 'Verify Property'}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              {modalAction === 'details' && modalData && (
                                  <Card>
                                    <Box>
                                      {Object.entries(propertyData).map(([key, value]) => (
                                          key === 'propertyImageUrl' ? (
                                              <Box key={key} display="flex" flexDirection="row" mb={2}>
                                                <Text fontWeight="bold" flex="0 0 30%" pr={2}>
                                                  {key}
                                                </Text>
                                                <Image src={value} height={'200px'}></Image>
                                              </Box>
                                          ): key === 'isVerified' ? (
                                                  <Box key={key} display="flex" flexDirection="row" mb={2}>
                                                    <Text fontWeight="bold" flex="0 0 30%" pr={2}>
                                                      {key}
                                                    </Text>
                                                    <Flex align='center'>
                                                    setValuationAmount      <Icon
                                                          w='24px'
                                                          h='24px'
                                                          me='5px'
                                                          color={
                                                            value === '1'
                                                                ? "green.500"
                                                                : value === '-1'
                                                                    ? "red.500"
                                                                    : value === '0'
                                                                        ? "orange.500"
                                                                        : null
                                                          }
                                                          as={
                                                            value === '1'
                                                                ? MdCheckCircle
                                                                : value === '-1'
                                                                    ? MdCancel
                                                                    : value === '0'
                                                                        ? MdOutlineError
                                                                        : null
                                                          }
                                                      />
                                                    </Flex>
                                                  </Box>
                                              )
                                              : key === 'isListed' ? (
                                                      <Box key={key} display="flex" flexDirection="row" mb={2}>
                                                        <Text fontWeight="bold" flex="0 0 30%" pr={2}>
                                                          {key}
                                                        </Text>
                                                        <Flex align='center'>
                                                          <Icon
                                                              w='24px'
                                                              h='24px'
                                                              me='5px'
                                                              color={
                                                                value === '1'
                                                                    ? "green.500"
                                                                    : value === '-1'
                                                                        ? "red.500"
                                                                        : value === '0'
                                                                            ? "orange.500"
                                                                            : null
                                                              }
                                                              as={
                                                                value === '1'
                                                                    ? MdCheckCircle
                                                                    : value === '-1'
                                                                        ? MdCancel
                                                                        : value === '0'
                                                                            ? MdOutlineError
                                                                            : null
                                                              }
                                                          />
                                                        </Flex>
                                                      </Box>
                                                  )
                                              :(
                                              <Box key={key} display="flex" flexDirection="row" mb={2}>
                                                <Text fontWeight="bold" flex="0 0 30%" pr={2}>
                                                  {key}
                                                </Text>
                                                <Text flex="1">{value}</Text>
                                              </Box>
                                          )
                                      ))}
                                    </Box>
                                  </Card>
                              )}
                              {/* Other content for different modalAction or no modalData */}
                              {modalAction === 'update' && (
                                  <Select
                                      placeholder="Select an option"
                                      value={selectedOption}
                                      onChange={(e) => setSelectedOption(e.target.value)}
                                      defaultValue={parseInt(propertyData.isVerified)}>
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                    ))}
                                  </Select>
                              )}

                              {modalAction === 'listing' && (
                                  <form>
                                    <Card>
                                      <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'
                                            mb="25px">
                                        Request Information
                                      </Text>
                                      <Flex justify="space-between">
                                        <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Property ID
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            User ID
                                          </Text><Text color={textColor} fontSize='16px' fontWeight='700'
                                                       lineHeight='100%' mb="15px">
                                          Created Date
                                        </Text>
                                        </Box>
                                        <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.propertyId}
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.userId}
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.createdDate}
                                          </Text>
                                        </Box>
                                      </Flex>
                                      <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'
                                            mt={"25px"} mb="25px">
                                        Background Check
                                      </Text>
                                      <Flex justify="space-between">
                                        <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Service Used
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Cost Of The Service
                                          </Text><Text color={textColor} fontSize='16px' fontWeight='700'
                                                       lineHeight='100%' mb="15px">
                                          Result
                                        </Text>
                                        </Box>
                                        <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.backgroundCheck?.serviceUsed}
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.backgroundCheck?.costOfService}
                                          </Text>
                                          <Grid templateColumns={{base: '1fr', md: 'repeat(12, 1fr)'}} gap={4}>
                                            <GridItem colSpan={{base: 12, md: 3}}>
                                              <Select
                                                  placeholder="Select an option"
                                                  defaultValue={0}
                                                  onChange={(e) => setSelectedBackgroundCheck(e.target.value)}>
                                                {options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                      {option.label}
                                                    </option>
                                                ))}
                                              </Select>
                                            </GridItem>
                                          </Grid>
                                        </Box>
                                      </Flex>
                                      <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'
                                            mt={"25px"} mb="25px">
                                        House Inspection
                                      </Text>
                                      <Flex justify="space-between">
                                        <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Service Used
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Cost Of The Service
                                          </Text><Text color={textColor} fontSize='16px' fontWeight='700'
                                                       lineHeight='100%' mb="15px">
                                          Result
                                        </Text>
                                        </Box>
                                        <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.houseInspection?.serviceUsed}
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.houseInspection?.costOfService}
                                          </Text>
                                          <Grid templateColumns={{base: '1fr', md: 'repeat(12, 1fr)'}} gap={4}>
                                            <GridItem colSpan={{base: 12, md: 3}}>
                                              <Select
                                                  placeholder="Select an option"
                                                  defaultValue={0}
                                                  onChange={(e) => setSelectHouseInspection(e.target.value)}>
                                                {options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                      {option.label}
                                                    </option>
                                                ))}
                                              </Select>
                                            </GridItem>
                                          </Grid>
                                        </Box>
                                      </Flex>
                                      <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'
                                            mt={"25px"} mb="25px">
                                        House Valuation
                                      </Text>
                                      <Flex justify="space-between">
                                        <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Service Used
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="20px">
                                            Cost Of The Service
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700'
                                                       lineHeight='100%' mb="30px">
                                          Result
                                        </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            Valuation Amount &  monthly Rent
                                          </Text>
                                        </Box>
                                        <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.houseValuation?.serviceUsed}
                                          </Text>
                                          <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%'
                                                mb="15px">
                                            {listingData.houseValuation?.costOfService}
                                          </Text>
                                         
                                          <Grid templateColumns={{base: '1fr', md: 'repeat(12, 1fr)'}} gap={4}>
                                            <GridItem colSpan={{base: 12, md: 3}}>
                                              <Select
                                                  placeholder="Select an option"
                                                  defaultValue={0}
                                                  onChange={(e) => setSelectedHouseValuation(e.target.value)}>
                                                {options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                      {option.label}
                                                    </option>
                                                ))}
                                              </Select>
                                            </GridItem>
                                          </Grid>
                                          <Grid templateColumns={{base: '1fr', md: 'repeat(12, 1fr)'}} gap={4}>
                                            <GridItem colSpan={{base: 12, md: 3}}>
                                            <Input
                                              isRequired={true}
                                              fontSize='sm'
                                              ms={{ base: "0px", md: "0px" }}
                                              type='number'
                                              color={textColor}
                                              placeholder='house valuation'
                                              mb='24px'
                                              fontWeight='500'
                                              size='lg'
                                              name={"houseValuation"}
                                              onChange={handleInputChange}
                                              value={valuationAmount}
                                          />
                                            </GridItem>
                                            <GridItem colSpan={{base: 12, md: 3}}>
                                            <Input
                                              isRequired={true}
                                              fontSize='sm'
                                              color={textColor}
                                              ms={{ base: "0px", md: "0px" }}
                                              type='number'
                                              placeholder='monthly rent'
                                              mb='24px'
                                              fontWeight='500'
                                              size='lg'
                                              name={"monthlyRent"}
                                              onChange={handleInputChange}
                                              value={monthlyRent}
                                          />
                                            </GridItem>
                                          </Grid>
                                        </Box>
                                      </Flex>
                                    </Card>
                                  </form>
                              )}
                            </ModalBody>
                            <ModalFooter>
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                              </Button>
                              <Button variant='ghost' onClick={handleModalAction}>
                                {modalAction === 'details' ? 'Details' : modalAction === 'update' ? 'Verify' : 'Listing'}
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        <Button onClick={() => onOpen('update', {id: row.original.id})}
                                isDisabled={row.original.isVerified === '1'}
                                colorScheme="green" size="sm" marginLeft="1">
                          Verify
                        </Button>
                        <Button onClick={() => onOpen('listing', {id: row.original.id})}
                                isDisabled={(row.original.isListed === '1' && row.original.isVerified === '1')
                                    ||(row.original.isListed === '0' && row.original.isVerified === '0')
                                    ||(row.original.isListed === '-1' && row.original.isVerified === '0')
                                    ||(row.original.isListed === '-1' && row.original.isVerified === '1')
                        }
                                colorScheme="green" size="sm" marginLeft="1">
                          Listing
                        </Button>
                      </Flex>
                    </Grid>
                    )
                  } else if (cell.column.id === 'propertyImageUrl') {
                    data = (
                        <Image src={cell.value}
                        height={"auto"}>
                        </Image>
                    );
                  } else if (cell.column.id === 'propertyDocumentUrl') {
                    data = (
                        <Link color={'brand.300'} href={cell.value}> Link here
                        </Link>
                    );
                  } else if (cell.column.id === "isVerified") {
                    data = (
                        <Flex align='center'>
                          <Icon
                              w='24px'
                              h='24px'
                              me='5px'
                              color={
                                cell.value === '1'
                                    ? "green.500"
                                    : cell.value === '-1'
                                        ? "red.500"
                                        : cell.value === '0'
                                            ? "orange.500"
                                            : null
                              }
                              as={
                                cell.value === '1'
                                    ? MdCheckCircle
                                    : cell.value === '-1'
                                        ? MdCancel
                                        : cell.value === '0'
                                            ? MdOutlineError
                                            : null
                              }
                          />
                        </Flex>
                    );
                  } else if (cell.column.id === "isListed") {
                    data = (
                        <Flex align='center'>
                          <Icon
                              w='24px'
                              h='24px'
                              me='5px'
                              color={
                                cell.value === '1'
                                    ? "green.500"
                                    : cell.value === '-1'
                                        ? "red.500"
                                        : cell.value === '0'
                                            ? "orange.500"
                                            : null
                              }
                              as={
                                cell.value === '1'
                                    ? MdCheckCircle
                                    : cell.value === '-1'
                                        ? MdCancel
                                        : cell.value === '0'
                                            ? MdOutlineError
                                            : null
                              }
                          />
                        </Flex>
                    );
                  } else {
                    data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                    );
                  }
                  return (
                      <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{sm: "14px"}}
                          minW={{sm: "150px", md: "200px", lg: "auto"}}
                          borderColor='transparent'>
                        {data}
                      </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justify="space-between" align="center" mt="4">
        <Text color={textColor} fontSize="sm">
          Showing {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}
        </Text>
        <Flex align="center">
          <IconButton
              icon={<ChevronLeftIcon/>}
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              aria-label="Previous Page"
          />
          <Text color={textColor} fontSize="sm" mx="2">
            Page {pageIndex + 1}
          </Text>
          <IconButton
              icon={<ChevronRightIcon/>}
              onClick={nextPage}
              isDisabled={!canNextPage}
              aria-label="Next Page"
          />
        </Flex>
      </Flex>

    </Card>
  );
}
