import {
  Box,
  Button,
  Flex, Grid, Icon, IconButton, Input, Select,
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
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";

function fetchSubmitListingPropertyByIdData(id) {
  return fetch(config.API_URL+"propertyInspectionServices/"+id)
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

export default function HouseInspectionTable(props) {
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
    { value: true, label: "Success" },
    { value: false, label: "Failed" },
  ];
  useEffect(() => {
    if (modalAction==="update") {
      const fetchData = async () => {
        try {
          const data = await fetchSubmitListingPropertyByIdData(modalData.id);
          setSubmitListingPropertyData(data.data);
          setSelectedOption(submitListingPropertyData.result);
        } catch (error) {
          console.error('Error in component:', error);
        }
      };
      fetchData();
    }
  }, [modalAction, modalData,submitListingPropertyData.result]);

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
                      <Flex justifyContent="space-center" alignItems="center">
                        <Modal isOpen={isOpen} size={size} onClose={onClose}>
                          <ModalOverlay />
                          <form>
                            <ModalContent>
                              <ModalHeader>{modalAction === 'details' ? 'Details Property' : 'Verify Property'}</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <>
                                  <Select
                                      placeholder="Select an option"
                                      fontSize='sm'
                                      color={textColor}
                                      ms={{ base: "0px", md: "0px" }}
                                      mb='24px'
                                      fontWeight='500'
                                      size='lg'
                                      value={selectedOption}
                                      onChange={(e) => setSelectedOption(e.target.value)}
                                  >
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                    ))}
                                  </Select>
                                  {selectedOption !== true && (
                                      <form>
                                        <Input
                                            isRequired={true}
                                            value={listingPropertyData.propertyValuation}
                                            type="number"
                                            name="propertyValuation"
                                            fontSize='sm'
                                            color={textColor}
                                            ms={{ base: "0px", md: "0px" }}
                                            mb='24px'
                                            fontWeight='500'
                                            size='lg'
                                            placeholder="Property Valuation"
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            isRequired={true}
                                            value={listingPropertyData.monthlyRent}
                                            type="number"
                                            fontSize='sm'
                                            color={textColor}
                                            ms={{ base: "0px", md: "0px" }}
                                            mb='24px'
                                            fontWeight='500'
                                            size='lg'
                                            name="monthlyRent"
                                            min={500}
                                            placeholder="Monthly Rent"
                                            onChange={handleInputChange}
                                        />
                                        <Select
                                            isRequired={true}
                                            placeholder="Select a Property Manager"
                                            fontSize='sm'
                                            color={textColor}
                                            ms={{ base: "0px", md: "0px" }}
                                            mb='24px'
                                            fontWeight='500'
                                            size='lg'
                                            name="propertyManagerId"
                                            value={listingPropertyData.propertyManagerId}
                                            onChange={handleInputChange}>
                                          {optionManager.map((option) => (
                                              <option key={option.id} value={option.id}>
                                                {option.name}
                                              </option>
                                          ))}
                                        </Select>
                                      </form>
                                  )}
                                </>
                              </ModalBody>
                              <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                  Close
                                </Button>
                                <Button variant='ghost' type={"submit"} onClick={handleModalAction}>
                                  {modalAction === 'details' ? 'Details Action' : 'Update Action'}
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </form>

                        </Modal>
                        <Button onClick={() => onOpen('create', {id:row.original.id})}
                                isDisabled={row.original.result === true}
                                colorScheme="blue" size="sm" marginLeft="1">
                          Create
                        </Button>
                        <Button onClick={() => onOpen('update', {id:row.original.id})}
                                isDisabled={row.original.result === true}
                                colorScheme="green" size="sm" marginLeft="1">
                          Update
                        </Button>
                        <Button onClick={() => onOpen('delete', {id:row.original.id})}
                                isDisabled={row.original.result === true}
                                colorScheme="red" size="sm" marginLeft="1">
                          Delete
                        </Button>
                      </Flex>
                    )
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
