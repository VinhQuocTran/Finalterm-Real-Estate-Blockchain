import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
    HouseInspectionColumnsData
} from "./variables/HouseInspectionColumnsData";
import config from '../../../config.json';
import HouseInspectionTable  from "./components/HouseInspectionTable";
function fetchListingPropertyData() {
    return fetch(config.API_URL+"propertyInspectionServices")
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
function fetchPropertyManagerData() {
    return fetch(config.API_URL+"propertyManagers")
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
export default function PropertyManager() {
    let [propertyData, setPropertyData] = useState([{}]);
    let [optionManagers, setOptionManagers] = useState([]);

    const [reload, setReload] = useState(false);
    const reloadParent = () => {
        setReload((prev) => !prev);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchListingPropertyData();
                setPropertyData(data.data);
                console.log(data)
                const dataManager = await fetchPropertyManagerData();
                setOptionManagers(dataManager.data.map((manager) => ({
                    id: manager.id,
                    name: manager.name,
                })));
            } catch (error) {
                console.error('Error in component:', error);
            }
        };

        fetchData();
    }, [reload]);
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 0, md: 0 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <HouseInspectionTable
          columnsData={HouseInspectionColumnsData}
          tableData={propertyData}
          optionManager={optionManagers}
          reloadParent = {reloadParent}
        />
      </SimpleGrid>
    </Box>
  );
}
