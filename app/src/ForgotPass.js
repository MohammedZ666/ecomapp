import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState } from 'react';
import { useHistory } from "react-router-dom"
import Copyright from './Copyrignt'
import Snackbar from '@material-ui/core/Snackbar';

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
const ForgotPass = () => {
    const classes = useStyles();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState('');
    const [submission, setSubmission] = useState({ "email": "" })
    const history = useHistory();
    const [openSnack, setOpenSnack] = useState({ message: "", bool: false });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack({ message: "", bool: false });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true)

        fetch('/forgot-password/', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission)
        }).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(async (res) => {
                console.log(res)
                if (res.data.msg === "success") {
                    setOpenSnack({ message: "Please check email for the reset link", bool: true });
                    await new Promise(r => setTimeout(r, 2000));
                    history.push('/')
                    history.go()

                }
                else {
                    setOpenSnack({ message: "Error! Could not send email", bool: true });
                }
                setIsError(res.data)
                setIsPending(false)
            }));
    }
    return (
        <div className="sign-in-page">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        please provide an email
         </Typography>
                    <form onSubmit={handleSubmit} className={classes.form} noValidate>
                        <TextField
                            error={isError.email || false}
                            helperText={isError.email}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => {
                                submission.email = e.target.value
                                setSubmission(submission)
                            }}
                        />

                        <button> {isPending ? "sending..." : "send"}</button>


                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
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
export default ForgotPass;
