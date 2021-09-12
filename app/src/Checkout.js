import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import useFetch from './useFetch'
import Snackbar from '@material-ui/core/Snackbar';

const Checkout = ({ handleCartLength }) => {
    const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')))
    const [counts, setCounts] = useState(JSON.parse(sessionStorage.getItem('count')))
    const [total, setTotal] = useState(0)
    const { data, error, pending } = useFetch("/user")
    const [user, setUser] = useState(null)
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [isPending, setIsPending] = useState(false)
    const history = useHistory()
    const [openSnack, setOpenSnack] = useState({ message: "", bool: false });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack({ message: "", bool: false });
    };


    useEffect(() => {

        if (cart != null) {
            let temp = 0;
            cart.forEach((product, i) => {
                temp += parseFloat(product.price) * counts[i]
            })
            setTotal(temp)
        }
    }, [counts, cart])

    useEffect(() => {

        if (data) {
            setUser(data)
            setAddress(data.address)
            setPhone(data.phone)
        }
    }, [data])

    //   email: {
    //     type: String,
    //     required: true
    // },
    // username: {
    //     type: String,
    //     required: true
    // },
    // status: {
    //     type: String,
    //     required: true
    // },
    // address: {
    //     type: String,
    //     required: true
    // },
    // phone: {
    //     type: String,
    //     required: true
    // },
    // cart: {
    //     type: Array,
    //     required: true,
    // },
    // counts: {
    //     type: Array,
    //     required: true,
    // }
    const handleSubmit = (e) => {
        e.preventDefault()
        const submission = {
            email: data.email,
            username: data.username,
            status: "new",
            address: address,
            phone: phone,
            cart: cart,
            counts: counts,

        }
        if (isPending) return
        setIsPending(true)
        console.log("order placed")
        fetch('/data/order/place-order', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission)
        }).then((result) => {
            console.log(result)
            if (!result.ok) {
                alert("Your order could not be placed")
                setOpenSnack("Sorry, couldn't place order, please check network", true)

            }
            else {
                setOpenSnack("Order placed successfully", true)
                sessionStorage.clear('cart')
                sessionStorage.clear('count')
                history.push('/')
                history.go()

            }
            return result.json()
        }).then(res => {
            setIsPending(false)
        });
    }


    const handleCount = (isAdd, i) => {
        console.log("long ago, ", cart)
        if (isAdd) {
            counts[i]++;
        }
        else {
            if (counts[i] > 0) {
                counts[i]--;
                if (counts[i] === 0) {
                    if (cart.length === 1) {
                        setCart(null)
                        setCounts(null)
                        sessionStorage.removeItem('cart')
                        sessionStorage.removeItem('count')
                        handleCartLength(0)
                        return
                    }
                    else {
                        console.log("before, ", cart)
                        counts.splice(i, 1)
                        console.log("after, ", cart.splice(i, 1))

                    }

                }
            }
        }
        setCounts([...counts]);
        sessionStorage.setItem('cart', JSON.stringify(cart))
        sessionStorage.setItem('count', JSON.stringify(counts))
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: "wrap",
            width: "70%",
            margin: "0 auto"

        }}>
            {!cart && <div className="not-found">
                <h2>Sorry no item was added</h2>
                <Link to="/">Back to the homepage...</Link>
            </div>}
            {cart && <div>
                {cart.map((product, i) => (

                    <Card style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: "2%"
                    }} key={product._id} >
                        <CardMedia
                            style={{ width: 140 }}
                            image={product.images[0]}
                            title={product.name}
                        />

                        <CardContent style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "space-evenly",
                            width: "100%"
                        }} >
                            <div style={{ width: "34%" }}>
                                <p style={{ fontSize: 20, }}>  <b> {product.name}</b>  </p>
                            </div>
                            <div style={{ width: "33%" }}>
                                <div className="add-cart">
                                    <ButtonGroup style={{ margin: "2%" }} size="small" aria-label="small outlined button group">
                                        <Button onClick={() => handleCount(true, i)}>+</Button>
                                        <Button disabled>{counts[i]}</Button>
                                        <Button onClick={() => handleCount(false, i)}>-</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div style={{ width: "33%" }}>
                                <p style={{ fontSize: 20, }}>  <b> ৳ {parseFloat(product.price) * counts[i]}</b>  </p>
                            </div>
                        </CardContent>
                    </Card>
                ))
                }
                <Card style={{
                    marginTop: "2%"
                }}>
                    <CardContent style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",

                    }} >
                        <p style={{ fontSize: 20, }}>Total </p>
                        <p style={{ fontSize: 20, }}> <b> ৳ {total}</b>  </p>
                    </CardContent>
                    <CardContent style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",

                    }} >
                        <p style={{ fontSize: 20, }}>Delivery Charge </p>
                        <p style={{ fontSize: 20, }}>  <b> ৳ 12</b>  </p>

                    </CardContent>
                    <CardContent style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",

                    }} >
                        <p style={{ fontSize: 20, }}>Net Price </p>
                        <p style={{ fontSize: 20, }}>  <b> ৳ {total + 12}</b>  </p>

                    </CardContent>
                </Card>

                {data && <Card style={{
                    marginTop: "2%"
                }}>
                    <CardContent   >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            marginTop: "4%",
                            marginBottom: "2%"

                        }}>
                            <p style={{ fontSize: 20, }}>Deliver to </p>
                            <p style={{ fontSize: 20, }}> <b>{data.username}</b>  </p>
                        </div>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            value={phone}
                            required
                            fullWidth
                            name="phone"
                            label="Phone"
                            id="phone"
                            type="tel"
                            onChange={(e) => {
                                setPhone(e.target.value)
                            }}
                        />
                        <TextField
                            multiline={true}
                            variant="outlined"
                            margin="normal"
                            value={address}
                            required
                            fullWidth
                            name="address"
                            label="Address"
                            id="address"
                            onChange={(e) => {
                                setAddress(e.target.value)
                            }}
                        />

                        <button style={{
                            marginTop: "3%"
                        }} class="button-class"
                            onClick={handleSubmit}>

                            {isPending ? "Placing order" : "Confirm and Place Order"}

                        </button>

                    </CardContent>

                </Card>}
            </div>}


            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={openSnack.bool}
                autoHideDuration={6000}
                onClose={handleClose}
                message={<div style={{ color: "white" }}>
                    {openSnack.message}
                </div>}
            />

        </div >
    );
}
export default Checkout;