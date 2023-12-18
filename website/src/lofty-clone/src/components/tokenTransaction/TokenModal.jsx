import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, makeStyles } from '@material-ui/core';
import {useParams} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../../utils/api.js";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));
const TokenModal = ({ isOpen, onClose, actionType,token }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        quantity:0,
        at_price:0,
        token_id:"",
        is_buy:true
    });
    const { propertyId } = useParams();
    useEffect(() => {
    }, [propertyId]);

    const currentUser = useSelector(state => state.user)
    const jwt = currentUser.token;
    const handleAmountChange = (event) => {
        const { name, value} = event.target;
        if(actionType==="buy"){
            setFormData({
                ...formData,
                ["is_buy"]: true
            });
        }
        else {
            setFormData({
                ...formData,
                ["is_buy"]: false
            });
        }
        let maxQuantity = token?.quantity;
        if (name==="quantity" && value >= 1 && value <= maxQuantity) {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        else if(name==="quantity" && value===""){
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        else if(name==="at_price") {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target)
        console.log(Object.fromEntries(data));
        const response = await axios.post(BASE_URL + "/chains/offers", Object.fromEntries(data), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            }
        });
        console.log(jwt)
        if (response.data.status === "success") {
            console.log(response.data);
            console.log(`Perform ${actionType} action with amount: ${JSON.stringify(formData)}`);
        }
        setFormData({
            quantity: 0,
            at_price: 0,
            token_id: "",
            is_buy: true
        });
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            className={classes.modal}>
            <div className={classes.paper}>
                <h2 style={{margin: '15px'}}>{actionType === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div style={{marginBottom: '15px'}}>
                        <span style={{margin: '15px'}}>Current price: {token?.token_price}</span>
                    </div>
                    <div>
                        <span style={{margin: '15px'}}>Total tokens: {token?.quantity}</span>
                    </div>
                    <TextField
                        label="Quantity"
                        type="number"
                        name={"quantity"}
                        inputProps={{min: 1, max: token?.quantity}}
                        value={formData.quantity}
                        onChange={handleAmountChange}
                        fullWidth
                        required
                        style={{margin: '15px'}}
                    />
                    <TextField
                        label="At price"
                        type="number"
                        name={"at_price"}
                        value={formData.at_price}
                        onChange={handleAmountChange}
                        fullWidth
                        required
                        style={{margin: '15px'}}
                    />

                    <TextField
                        label="At price"
                        type="text"
                        name={"token_id"}
                        value={token?.id}
                        onChange={handleAmountChange}
                        fullWidth
                        required
                        style={{margin: '15px', display:'none'}}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{margin: '15px'}}
                    >
                        {actionType === 'buy' ? 'Buy' : 'Sell'}
                    </Button>

                </form>
            </div>
        </Modal>
    );
};

export default TokenModal;
