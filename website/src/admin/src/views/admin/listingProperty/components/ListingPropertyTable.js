import {
  Box,
  Button,
  Flex, FormControl, FormLabel, Grid, Icon, IconButton, Image, Input, Link, Select,
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

export default function ListingPropertyTable(props) {
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
  const [size, setSize] = React.useState('xl')
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState({
    listingPropertyId:0,
    valuationAmount:0,
    monthlyRent:0
  });

  const onOpen = (action, dataInput) => {
    setModalAction(action);
    setModalData(dataInput);
    console.log(dataInput);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setModalAction(null);
    setModalData(null);
  };
  const handleInputChange =(event) =>{
    const { name, value} = event.target;
    if(name ==="valuationAmount" && value<20000){
      setModalData({
        ...modalData,
        [name]: 20000,
      })
    }
    else if(name ==="monthlyRent" && value<0) {
      setModalData({
        ...modalData,
        [name]: 0,
      })
    }
    else{
        setModalData({
          ...modalData,
          [name]: value,
        });
    }
  }
  const handleModalAction = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt");
      await axios.post(config.API_URL + `chains/updateToken`, modalData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      console.log('Listing property updated successfully!');
      reloadParent();
    } catch (error) {
      console.error('Error updating listing property:', error);
    }
      onClose();
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
                      <Flex justifyContent="space-center" alignItems="center">
                        <Modal isOpen={isOpen} size={size} onClose={onClose}>
                          <ModalOverlay />
                          <form>
                            <ModalContent>
                              <ModalHeader>Update Listing Property</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <FormControl>
                                  <FormLabel htmlFor="houseValuation">House Valuation</FormLabel>
                                  <Input
                                      isRequired={true}
                                      fontSize='sm'
                                      ms={{ base: "0px", md: "0px" }}
                                      type='number'
                                      color={textColor}
                                      placeholder='Enter house valuation'
                                      mb='24px'
                                      fontWeight='500'
                                      size='lg'
                                      name={"valuationAmount"}
                                      id="houseValuation"
                                      onChange={handleInputChange}
                                      value={modalData?.valuationAmount}
                                  />
                                </FormControl>
                                <FormControl>
                                  <FormLabel htmlFor="monthlyRent">Monthly Rent</FormLabel>
                                  <Input
                                      isRequired={true}
                                      fontSize='sm'
                                      ms={{ base: "0px", md: "0px" }}
                                      type='number'
                                      color={textColor}
                                      placeholder='Enter monthly rent'
                                      mb='24px'
                                      fontWeight='500'
                                      size='lg'
                                      name={"monthlyRent"}
                                      id="monthlyRent"
                                      onChange={handleInputChange}
                                      value={modalData?.monthlyRent}
                                  />
                                </FormControl>
                              </ModalBody>
                              <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                  Close
                                </Button>
                                <Button variant='ghost' onClick={handleModalAction}>
                                  Update
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </form>
                        </Modal>
                        <Button onClick={() => onOpen('update', {listingPropertyId:row.original.id,valuationAmount:row.original.propertyValuation, monthlyRent:row.original.monthlyRent})} colorScheme="green" size="sm" marginLeft="1">
                          Update
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
