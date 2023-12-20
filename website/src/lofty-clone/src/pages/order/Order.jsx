import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import BasicTable from "../../components/basicTable/BasicTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setLightTheme } from "../../redux/themeSlice";
import orders from "./dummyData.json";
import "./order.scss";

const Order = () => {
    // const appTheme = useSelector(state => state.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLightTheme());
    }, []);

    const columns = [
        {
            header: 'Created Date',
            accessorKey: 'createdDate',
        },
        {
            header: 'House name',
            accessorKey: 'houseName',
        },
        {
            header: 'URL',
            accessorKey: 'url',
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
        },
        {
            header: 'Price',
            accessorKey: 'price',
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'Type',
            accessorKey: 'type',
        },
        {
            header: 'Click to cancel',
            accessorKey: 'delete',
            cell: (data) => {
                return (
                    <a style={{color: 'red', textDecoration: 'none'}} href="">Cancel</a>
                );
            },
        },
    ];

    return (
        <div className="order">
            <ContentWrapper>
                <BasicTable data={orders} columns={columns} />
            </ContentWrapper>
        </div>
    );
}

export default Order;