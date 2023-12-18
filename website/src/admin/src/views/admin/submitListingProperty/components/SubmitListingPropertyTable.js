import {
  Box,
  Button,
  Flex, Grid, GridItem, Icon, IconButton, Input, Select,
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
import {MdCancel, MdCheckCircle, MdOutlineError} from "react-icons/md";
import {list} from "@chakra-ui/system";

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

export default function SubmitListingPropertyTable(props) {
  const { columnsData, tableData,optionManager, reloadParent } = props;
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
  const [submitListingPropertyData, setSubmitListingPropertyData] = useState({});
  const [listingPropertyData, setListingPropertyData] = React.useState({
    createdAt: new Date(),
    listedDate: new Date(),
    monthlyRent: '',
    propertyManagerId: '',
    propertyValuation: '',
    submitListingPropertyId: '',
    updatedAt: new Date()
  })
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    { value: true, label: "Passed" },
    { value: false, label: "Failed" },
  ];
  useEffect(() => {
    if (modalAction==="update") {
      const fetchData = async () => {
        try {
          const data = await fetchRequestListingProcess(modalData.id);
          setSubmitListingPropertyData(data.data);
          console.log(data.data);
        } catch (error) {
          console.error('Error in component:', error);
        }
      };
      fetchData();
    }
  }, [modalAction, modalData]);

  const onOpen = (action, dataInput) => {
    setModalAction(action);
    setModalData(dataInput);
      setSize('full');
      setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setModalAction(null);
    setModalData(null);
    setListingPropertyData({
      createdAt: new Date(),
      listedDate: new Date(),
      monthlyRent: '',
      propertyManagerId: '',
      propertyValuation: '',
      submitListingPropertyId: '',
      updatedAt: new Date()
    });
  };

  const handleModalAction = async () => {
    if (modalAction === 'update') {
      console.log('Update action with data:', selectedOption);
      try {
        const jwtToken = localStorage.getItem("jwt");
        let prop = submitListingPropertyData;
        prop.result = selectedOption;
        await axios.patch(config.API_URL + `submitPropertyListings/` + submitListingPropertyData.id, prop, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });


        // console.log('Property updated successfully!');
        // if(prop.result==="true"){
        //   let listProp = listingPropertyData;
        //   listProp.createdAt = new Date();
        //   listProp.updatedAt = new Date();
        //   listProp.listedDate = new Date();
        //   listProp.submitListingPropertyId = submitListingPropertyData.id;
        //   const response = await axios.post(config.API_URL + `listingProperties/`, listProp, {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${jwtToken}`,
        //     },
        //   });
        //   console.log('Create ListingProperty successfully!');
        //   listProp = response.data.data
        //   const token = {
        //     listingPropertyId: listProp.id,
        //     propertyId: submitListingPropertyData.propertyId,
        //     propertyValuation: listProp.propertyValuation
        //   }
        //   console.log(token)
        //   const resToken = await axios.post(config.API_URL + `chains/tokens/`, token, {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${jwtToken}`,
        //     },
        //   });
        //   console.log('Create ListingProperty successfully!');
        // }
        reloadParent();
      } catch (error) {
        console.error('Error updating property:', error);
      }
      onClose();
    }
  };

  function handleInputChange(event) {
    const { name, value} = event.target;
    setListingPropertyData({
      ...listingPropertyData,
      [name]: value,
    });
  }

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
              fontSize={{ sm: "15px", lg: "12px" }}
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
                  pe='15px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "15px", lg: "12px" }}
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
                      <Flex justifyContent="space-center" alignItems="center">
                        <Modal isOpen={isOpen} size={size} onClose={onClose}>
                          <ModalOverlay />
                          <form>
                            <ModalContent>
                              <ModalHeader>{modalAction === 'details' ? 'Details Property' : 'Verify Property'}</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <form>
                                  <Card>
                                    <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%' mb="25px">
                                      Request Information
                                    </Text>
                                  <Flex justify="space-between">
                                      <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Property ID
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          User ID
                                        </Text><Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                        Created Date
                                      </Text>
                                      </Box>
                                      <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          PROPERTY_001
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          ACCOUNT_001
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          10/11/2023
                                        </Text>
                                      </Box>
                                  </Flex>
                                    <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%' mt={"25px"} mb="25px">
                                      Background Check
                                    </Text>
                                    <Flex justify="space-between">
                                      <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Service Used
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Cost Of The Service
                                        </Text><Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Result
                                      </Text>
                                      </Box>
                                      <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          BCS_001
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          $500
                                        </Text>
                                        <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={4}>
                                          <GridItem colSpan={{ base: 12, md: 3 }}>
                                            <Select
                                                placeholder="Select an option"
                                                value={selectedOption}
                                                onChange={(e) => setSelectedOption(e.target.value)}>
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
                                    <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%' mt={"25px"} mb="25px">
                                      House Inspection
                                    </Text>
                                    <Flex justify="space-between">
                                      <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Service Used
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Cost Of The Service
                                        </Text><Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                        Result
                                      </Text>
                                      </Box>
                                      <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          HIS_001
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          $500
                                        </Text>
                                        <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={4}>
                                          <GridItem colSpan={{ base: 12, md: 3 }}>
                                            <Select
                                                placeholder="Select an option"
                                                value={selectedOption}
                                                onChange={(e) => setSelectedOption(e.target.value)}>
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
                                    <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%' mt={"25px"} mb="25px">
                                      House Valuation
                                    </Text>
                                    <Flex justify="space-between">
                                      <Box flex="1" mr={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Service Used
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          Cost Of The Service
                                        </Text><Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                        Result
                                      </Text>
                                      </Box>
                                      <Box flex="1" ml={{base: '0px', md: '4px'}}>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          HVS_001
                                        </Text>
                                        <Text color={textColor} fontSize='16px' fontWeight='700' lineHeight='100%' mb="15px">
                                          $500
                                        </Text>
                                        <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={4}>
                                          <GridItem colSpan={{ base: 12, md: 3 }}>
                                            <Select
                                                placeholder="Select an option"
                                                value={selectedOption}
                                                onChange={(e) => setSelectedOption(e.target.value)}>
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
                                    <br/>
                                    <Flex justifyContent="flex-end">
                                      <Box flex="1" mr={{ base: '0px', md: '10px' }}>
                                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                                          Close
                                        </Button>
                                      </Box>
                                      <Box flex="1" mr={{ base: '0px', md: '10px' }}>
                                        <Button colorScheme='green' type="submit" onClick={handleModalAction}>
                                          {modalAction === 'details' ? 'Details Action' : 'Listing Action'}
                                        </Button>
                                      </Box>
                                    </Flex>
                                  </Card>
                                </form>
                              </ModalBody>
                            </ModalContent>
                          </form>

                        </Modal>
                        <Button onClick={() => onOpen('update', {id:row.original.id})}
                                isDisabled={row.original.isPass === "1"}
                                colorScheme="green" size="sm" marginLeft="1">
                          Listing
                        </Button>
                      </Flex>
                    )
                  }
                  else if (cell.column.id === "isPass") {
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
                  }
                  else {
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
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
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
              icon={<ChevronLeftIcon />}
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              aria-label="Previous Page"
          />
          <Text color={textColor} fontSize="sm" mx="2">
            Page {pageIndex + 1}
          </Text>
          <IconButton
              icon={<ChevronRightIcon />}
              onClick={nextPage}
              isDisabled={!canNextPage}
              aria-label="Next Page"
          />
        </Flex>
      </Flex>

    </Card>
  );
}
