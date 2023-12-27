import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, makeStyles } from '@material-ui/core';
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/api.js";
import { useSelector } from "react-redux";
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
const TokenModal = ({ isOpen, onClose, actionType, token,toast }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        quantity: 0,
        at_price: 0,
        token_id: "",
        is_buy: true
    });

    const { propertyId } = useParams();
    const [tokenOwnerShip, setTokenOwnerShip] = useState(null);
    const currentUser = useSelector(state => state.user)
    const jwt = currentUser.token;
    useEffect(() => {
        if (actionType === "sell" && isOpen === true) {
            const fetchTokenOwnerShip = async () => {
                try {
                    let response = await axios.get(BASE_URL + `/properties/getTokenOwnership/${currentUser.user.id}/${token.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`,
                        }
                    });
                    setTokenOwnerShip(response.data.data.tokenOwnerShip);
                    console.log(response.data)
                } catch (err) {
                    console.log(err);
                }
            }
            fetchTokenOwnerShip();
        }

    }, [isOpen, actionType, propertyId]);


    const handleAmountChange = (event) => {
        const { name, value } = event.target;
        if (actionType === "buy") {
            setFormData({
                ...formData,
                ["is_buy"]: true
            });
            let maxQuantity = token?.quantity;
            if (name === "quantity" && value >= 1 && value <= maxQuantity) {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
            else if (name === "quantity" && value === "") {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
            else if (name === "at_price") {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        }
        else {
            setFormData({
                ...formData,
                ["is_buy"]: false
            });
            let maxQuantity = tokenOwnerShip?.own_number;
            if (name === "quantity" && value >= 1 && value <= maxQuantity) {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
            else if (name === "quantity" && value === "") {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
            else if (name === "at_price") {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target)
        if (actionType === "buy") {
            data.append("is_buy", true);
        }
        else{
            data.append("is_buy", false);
        }
        console.log(Object.fromEntries(data));
        try {
            const response = await axios.post(BASE_URL + "/chains/offers", Object.fromEntries(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            });
            if (response.data.status === "success") {
                toast.success('Create offer success!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
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
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
        catch (err) {
            toast.error('Create offer failed!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            console.log(err);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            className={classes.modal}>
            <div className={classes.paper}>
                <h2 style={{ margin: '15px' }}>{actionType === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}</h2>
                <form onSubmit={handleFormSubmit}>
                    {actionType === 'sell' ? (
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ margin: '15px' }}>Current price: {token?.token_price}</span>
                            </div>
                            <div>
                                <span style={{ margin: '15px' }}>Your tokens: {tokenOwnerShip?.own_number}</span>
                            </div>
                            <TextField
                                label="Quantity"
                                type="number"
                                name={"quantity"}
                                inputProps={{ min: 1, max: tokenOwnerShip?.own_number }}
                                value={formData.quantity}
                                onChange={handleAmountChange}
                                fullWidth
                                required
                                style={{ margin: '15px' }}
                            />
                            <TextField
                                label="At price"
                                type="number"
                                name={"at_price"}
                                value={formData.at_price}
                                onChange={handleAmountChange}
                                fullWidth
                                required
                                style={{ margin: '15px' }}
                            />

                            <TextField
                                label="At price"
                                type="text"
                                name={"token_id"}
                                value={token?.id}
                                onChange={handleAmountChange}
                                fullWidth
                                required
                                style={{ margin: '15px', display: 'none' }}
                            />
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ margin: '15px' }}>Current price: {token?.token_price}</span>
                            </div>
                            <div>
                                <span style={{ margin: '15px' }}>Total tokens: {token?.quantity}</span>
                            </div>
                            <TextField
                                label="Quantity"
                                type="number"
                                name={"quantity"}
                                inputProps={{ min: 1, max: token?.quantity }}
                                value={formData.quantity}
                                onChange={handleAmountChange}
                                fullWidth
                                required
                                style={{ margin: '15px' }}
                            />
                            <TextField
                                label="At price"
                                type="number"
                                name={"at_price"}
                                value={formData.at_price}
                                onChange={handleAmountChange}
                                fullWidth
                                required
                                style={{ margin: '15px' }}
                            />

                            <TextField
                                label="At price"
                                type="text"
                                name={"token_id"}
                                value={token?.id}
                                onChange={handleAmountChange}
                                fullWidth
                                required
                                style={{ margin: '15px', display: 'none' }}
                            />
                        </>
                    )
                    }


                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ margin: '15px' }}>
                        {actionType === 'buy' ? 'Buy' : 'Sell'}
                    </Button>

                </form>
            </div >
        </Modal >
    );
};

export default TokenModal;
