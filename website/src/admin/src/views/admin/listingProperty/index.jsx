// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
    columnsDataListingProperty
} from "views/admin/listingProperty/variables/columnsData";
import config from '../../../config.json';
import ColumnsTable from "./components/ColumnsTable";
function fetchListingPropertiesData() {
    return fetch(config.API_URL+"properties/")
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
const listingPropertyModel = {
    id: 0,
    monthly_rent: 0,
    listed_date: new Date(),
    property_valuation: 0,
    property_manager_id: 0,
    submit_listing_property_id: 0,
    propertyManager: {
        id: 0,
    },
    submitListingProperty: {
        id: 0,
    },
};


export default function Settings() {
    let [listingPropertyData, setListingPropertyData] = useState([{
        id: 0,
        monthly_rent: 0,
        listed_date: "",
        property_valuation: 0,
        property_manager_id: 0,
        submit_listing_property_id: 0,
        propertyManager: {
            id: 0,
        },
        submitListingProperty: {
            id: 0,
        }
    }]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchListingPropertiesData();
                // setListingPropertyData(data.data);
                console.log(data)
            } catch (error) {
                console.error('Error in component:', error);
            }
        };

        fetchData();
    }, []);
    console.log(listingPropertyData)
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 0, md: 0 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <ColumnsTable
          columnsData={columnsDataListingProperty}
          tableData={listingPropertyData}
        />
      </SimpleGrid>
    </Box>
  );
}
