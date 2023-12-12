const columnsDataListingProperty = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Monthly Rent",
    accessor: "monthly_rent",
  },
  {
    Header: "Listed Date",
    accessor: "listed_date",
    // You might want to use a custom cell renderer for dates
    Cell: ({ value }) => new Date(value).toLocaleDateString(),
  },
  {
    Header: "Property Valuation",
    accessor: "property_valuation",
  },
  {
    Header: "Property Manager ID",
    accessor: "property_manager_id",
  },
  {
    Header: "Submit Listing Property ID",
    accessor: "submit_listing_property_id",
  },
  {
    Header: "Property Manager ID",
    accessor: "propertyManager.id",
  },
  {
    Header: "Submit Listing Property ID",
    accessor: "submitListingProperty.id",
  },
  {
    Header: 'Actions',
    accessor: 'actions'
  },
];

export { columnsDataListingProperty };