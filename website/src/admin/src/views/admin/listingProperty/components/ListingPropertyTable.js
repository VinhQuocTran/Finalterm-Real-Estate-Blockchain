import {
  Box,
  Button,
  Flex, Grid, Icon, IconButton, Image, Input, Link, Select,
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
  const [size, setSize] = React.useState('full')
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [propertyData, setPropertyData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const options = [
    { value: 1, label: "Success" },
    { value: 0, label: "In Progress" },
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
  };

  const handleModalAction = async () => {
    if (modalAction === 'update') {
      console.log('Update action with data:', selectedOption);
      try {
        const jwtToken = localStorage.getItem("jwt");
        let prop = propertyData;
        prop.isVerified = selectedOption;
        await axios.patch(config.API_URL + `properties/` + propertyData.id+'/updateIsVerified', prop, {
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
                        <Button onClick={() => onOpen('details', {id:row.original.id})} colorScheme="teal" size="sm" marginLeft="1">
                          Details
                        </Button>
                        <Modal isOpen={isOpen} size={size} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>{modalAction === 'details' ? 'Details Property' : 'Verify Property'}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              {/* Conditionally render content based on modalAction and modalData */}
                              {modalAction === 'details' && modalData && (
                                  <Card>
                                    <Box>
                                      {Object.entries(propertyData).map(([key, value]) => (
                                          (
                                              // Additional condition for 'someOtherKey'
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

                              {modalAction === 'details' && !propertyData && <p>Loading...</p>}
                            </ModalBody>
                            <ModalFooter>
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                              </Button>
                              <Button variant='ghost' onClick={handleModalAction}>
                                {modalAction === 'details' ? 'Details Action' : 'Verify Action'}
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        <Button onClick={() => onOpen('update', {id:row.original.id})} colorScheme="green" size="sm" marginLeft="1">
                          Update
                        </Button>
                        <Button onClick={() => onOpen('delete', {id:row.original.id})} colorScheme="red" size="sm" marginLeft="1">
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
