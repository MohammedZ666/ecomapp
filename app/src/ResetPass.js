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
import { useParams } from "react-router";

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
const ResetPass = () => {
    const classes = useStyles();
    const { email, otp } = useParams()
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState('');
    let [submission, setSubmission] = useState({
        email: email, otp: otp, password: "", confirmPassword: ""
    })
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

        fetch('/reset-password/', {
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
                    setOpenSnack({ message: "password reset successful", bool: true });
                    await new Promise(r => setTimeout(r, 2000));
                    history.push('/')
                    history.go()

                }
                else if (res.data.code === 0) {
                    setIsError(res.data.msg)
                }
                else {
                    setOpenSnack({ message: res.data.msg, bool: true });
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
                        reset password
         </Typography>
                    <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
                                submission.password = e.target.value
                                setSubmission(submission)
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
                            label="Confirm password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="current-password"
                            onChange={(e) => {
                                submission.confirmPassword = e.target.value
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
export default ResetPass;
