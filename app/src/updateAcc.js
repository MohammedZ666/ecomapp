import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"
import Copyright from './Copyrignt'
import useFetch from './useFetch'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

}));
const UpdateUser = () => {
    const classes = useStyles();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState('');
    const { data, error, userPending } = useFetch("/user")
    const [submission, setSubmission] = useState({
        "_id": "",
        "email": "",
        "password": "",
        "username": "",
        "phone": "",
        "address": ""

    })
    const [openSnack, setOpenSnack] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };

    const handleChange = (key, value) => {
        let tempSubmission = {
            ...submission
        }
        tempSubmission[key] = value
        setSubmission(tempSubmission)
    }

    useEffect(() => {
        if (data) { setSubmission(data) }
        console.log(data)
    }, [data])
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true)

        fetch('/update-user', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission)
        }).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(res => {

                if (res.data.user) {

                    setOpenSnack(true)
                }
                setIsError(res.data)
                setIsPending(false)
            }));
    }
    return (
        <div>
            {error && <div>{error}</div>}
            {userPending && <div>Loading...</div>}
            {data && <div className="sign-in-page">
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            update account
                         </Typography>
                        <form onSubmit={handleSubmit} className={classes.form} noValidate>

                            <TextField
                                error={isError.email || false}
                                helperText={isError.email}
                                value={submission.email}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => {
                                    handleChange("email", e.target.value)
                                }}
                            />
                            <TextField
                                error={isError.password || false}
                                helperText={isError.password}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => {
                                    handleChange("password", e.target.value)

                                }}
                            />
                            <TextField
                                error={isError.username || false}
                                helperText={isError.username}
                                value={submission.username}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="username"
                                name="username"
                                autoComplete="username"
                                onChange={(e) => {
                                    handleChange("username", e.target.value)
                                }}
                            />
                            <TextField
                                error={isError.phone || false}
                                helperText={isError.phone}
                                value={submission.phone}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="phone"
                                label="Phone"
                                name="phone"
                                autoComplete="phone"

                                onChange={(e) => {
                                    handleChange("phone", e.target.value)

                                }}
                            />
                            <TextField
                                error={isError.address || false}
                                helperText={isError.address}
                                value={submission.address}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                multiline
                                id="address"
                                label="Address"
                                name="address"
                                autoComplete="address"
                                onChange={(e) => {
                                    handleChange("address", e.target.value)
                                }}
                            />

                            <button> {isPending ? "updating..." : "update"}</button>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={openSnack}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        message={<div style={{ color: "white" }}>
                            account updated successfully
                            </div>}

                    />

                </Container>
            </div >}
        </div>


    );

}
export default UpdateUser;
