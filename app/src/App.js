import Home from './Home'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import Create from './Create';
import ProductDetails from './ProductDetails';
import Checkout from './Checkout'
import NotFound from './NotFound';
import Login from './Login'
import Signup from './Signup';
import Header from './header/Header'
import Fab from '@material-ui/core/Fab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useState, useEffect } from 'react';
import Badge from '@material-ui/core/Badge';
import UpdateUser from './updateAcc';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass'

const App = () => {
  let cart = JSON.parse(sessionStorage.getItem('cart'))
  const [cartLength, setCartLength] = useState(cart ? cart.length : 0)
  const handleCartLength = (length) => {
    setCartLength(length)
  }

  useEffect(() => {

  }, [cartLength])

  return (
    <Router>
      <div>
        <Header cartLength={cartLength} />
        <Fab style={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
          backgroundColor: '#ffff'
        }} aria-label="add"
          onClick={() => {
            var a = document.createElement('a');
            a.href = '/checkout';
            a.target = "_self"
            a.click()
          }} >
          <Badge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            badgeContent={cartLength} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/products/:id" >
              <ProductDetails handleCartLength={handleCartLength} />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/update-user">
              <UpdateUser />
            </Route>
            <Route path="/checkout" >
              <Checkout handleCartLength={handleCartLength} />
            </Route>
            <Route path="/forgotPassword" >
              <ForgotPass />
            </Route>
            <Route path="/resetPassword/:email/:otp">
              <ResetPass />
            </Route>
            <Route to="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>

  );
}

export default App;
