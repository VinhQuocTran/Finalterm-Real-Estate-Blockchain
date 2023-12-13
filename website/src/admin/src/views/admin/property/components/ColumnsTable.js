import {
  Button,
  Flex, Grid, Icon, Image, Link,
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


export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
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
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [size, setSize] = React.useState('full')
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [listingPropertyData, setListingPropertyData] = useState({});
  useEffect(() => {
    if (modalAction === 'details') {
      const fetchData = async () => {
        try {
          const data = await fetchPropertyByIdData(modalData.id);
          setListingPropertyData(data.data);
          console.log(data);
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
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setModalAction(null);
    setModalData(null);
  };
  const handleModalAction = () => {
    // Perform different actions based on the modalAction value
    if (modalAction === 'details') {
      // Handle details action with modalData
      console.log('Details action with data:', modalData);
      const id = modalData && modalData.id;
      // Handle details action with the id
      console.log('Details action with id:', id);
    } else if (modalAction === 'update') {
      // Handle update action with modalData
      console.log('Update action with data:', modalData);
    }

    // Close the modal
    onClose();
  };

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Table Property
        </Text>
      </Flex>
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
                            <ModalHeader>{modalAction === 'details' ? 'Details' : 'Update'}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <div> 123</div>
                            </ModalBody>
                            <ModalFooter>
                              <Button colorScheme='blue' mr={3} onClick={handleModalAction}>
                                Close
                              </Button>
                              <Button variant='ghost' onClick={handleModalAction}>
                                {modalAction === 'details' ? 'Details Action' : 'Update Action'}
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        <Button
                            onClick={onOpen}
                            colorScheme="green"
                            size="sm"
                            marginLeft="1">
                          Update
                        </Button>
                      </Flex>
                    </Grid>
                    )
                  }
                  else if(cell.column.id === 'propertyImageUrl'){
                    data = (
                        <Image src={cell.value}>
                        </Image>
                    );
                  }
                  else if(cell.column.id === 'propertyDocumentUrl'){
                    data = (
                        <Link color={'brand.300'} href={cell.value}> Link here
                        </Link>
                    );
                  }
                  else if (cell.column.id === "isVerified") {
                    data = (
                        <Flex align='center'>
                          <Icon
                              w='24px'
                              h='24px'
                              me='5px'
                              color={
                                cell.value === 1
                                    ? "green.500"
                                    : cell.value === -1
                                        ? "red.500"
                                        : cell.value === 0
                                            ? "orange.500"
                                            : null
                              }
                              as={
                                cell.value === 1
                                    ? MdCheckCircle
                                    : cell.value === -1
                                        ? MdCancel
                                        : cell.value === 0
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
    </Card>
  );
}
