import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState } from 'react';
import { useHistory } from "react-router-dom"
import Copyright from './Copyrignt'

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
const Login = () => {
    const classes = useStyles();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState('');
    const [submission, setSubmission] = useState({ "email": "", "password": "", "remember": false })
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true)

        fetch('/login', {
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
                    let savedPath =
                        localStorage.getItem("location")
                    if (savedPath) {
                        localStorage.removeItem("location")
                        history.replace(savedPath)
                        history.go()
                    }
                    else {
                        history.push("/")
                        history.go()
                    }
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
                        login
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" onChange={(e) => {
                                submission.remember = e.target.checked
                                setSubmission(submission)
                            }} />}
                            label="Remember me"
                        />
                        <button> {isPending ? "logging in..." : "login"}</button>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginTop: "0.5em" }}>
                            <Link href="/forgotPassword" variant="body2" >
                                Forgot password?
                                 </Link>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Register!"}
                            </Link>
                        </div>

                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </div >

    );

}
export default Login;
