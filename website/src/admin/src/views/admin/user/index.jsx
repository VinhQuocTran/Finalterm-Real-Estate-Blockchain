// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
    columnsDataColumns
} from "views/admin/user/variables/columnsData";
import config from '../../../config.json';
import UsersTable from "./components/UsersTable";
function fetchAccountsData() {
    return fetch(config.API_URL+"accounts/")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Accounts data:', data);
            return data;
        })
        .catch((error) => {
            console.error('Error fetching accounts data:', error);
            throw error;
        });
}
const userModel = {
    id: "",
    email: "",
    address: "",
    phoneNumber: "",
    residentId: "",
    cashBalance: "",
    tokenBalance: "",
    username: "",
    role: "",
    createdAt: "",
    updatedAt: "",
};

export default function Settings() {
    let [accountsData, setAccountsData] = useState([{
        userModel
    }]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAccountsData();
                setAccountsData(data.data);
                console.log(data)
            } catch (error) {
                console.error('Error in component:', error);
            }
        };

        fetchData();
    }, []);
    console.log(accountsData)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 0, md: 0 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <UsersTable
          columnsData={columnsDataColumns}
          tableData={accountsData}
        />
      </SimpleGrid>
    </Box>
  );
}
