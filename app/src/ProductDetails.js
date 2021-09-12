import { useParams, useLocation } from "react-router";
import { useState, useEffect } from 'react';
import useFetch from "./useFetch";
import Image from 'material-ui-image';
import Carousel from 'react-material-ui-carousel'
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useHistory } from "react-router-dom"
import './CommentDialog';
import CommentDialog from "./CommentDialog";
import CommentBox from "./CommentBox";

const ProductDetails = ({ handleCartLength }) => {
    const { id } = useParams();
    const [pQuery, setProductQuery] = useState('/data/products/' + id);
    const { data: product, error, isPending } = useFetch(pQuery)
    const [user, setUser] = useState(null)
    const {
        data: uData,
        error: uError,
        isPending: uIsPending
    } = useFetch('/user')
    const history = useHistory();
    const location = useLocation();
    let [count, setCount] = useState(1);
    const [open, setOpen] = useState(false);
    const [oldComment, setOldComment] = useState(null)

    useEffect(() => {
        setUser(uData)
        console.log(uData)
    }, [uData])

    const reload = () => {

        setProductQuery('')
        setProductQuery(pQuery)

    }
    const findElement = (cart) => {
        let i = -1
        cart.forEach((element, index) => {
            if (JSON.stringify(element) === JSON.stringify(product)) {
                i = index
            }
        });
        return i;
    }
    const handleEditComment = (oldComment) => {
        console.log(oldComment)
        setOldComment(oldComment)
        setOpen(true)
    }
    const handleClick = async () => {

        if (user) {
            let cart = JSON.parse(sessionStorage.getItem('cart'))
            let counts = JSON.parse(sessionStorage.getItem('count'))
            if (cart) {
                let i = findElement(cart)
                console.log(i)
                if (i !== -1) {
                    counts[i] = parseInt(counts[i]) + count
                }
                else {
                    cart.push(product)
                    counts.push(count)
                    sessionStorage.setItem('cart', JSON.stringify(cart))
                }
                sessionStorage.setItem('count', JSON.stringify(counts))
            }
            else {
                cart = [product]
                counts = [count]
                sessionStorage.setItem('cart', JSON.stringify(cart))
                sessionStorage.setItem('count', JSON.stringify(counts))
            }

            handleCartLength(cart.length)
        }
        else {
            localStorage.setItem("location", location.pathname)
            history.push("/login")
            history.go()

        }
    }
    const handleCount = (isAdd) => {
        if (isAdd)
            count++;

        else {
            if (count > 1) {
                count--;
            }
        }
        setCount(count);
    }

    let handleClickOpen = () => {
        if (!uIsPending && !user) {
            localStorage.setItem("location", location.pathname)
            history.push("/login")
            history.go()
            return;
        }
        setOpen(true);
    };

    let handleClose = () => {
        setOpen(false);
        setOldComment(null)
        reload();
    };
    return (
        <div className="product-details" >
            {(isPending || uIsPending) && <div> Loading </div>}
            {(error || uError) && <div>{error}</div>}
            {product && (<div>
                <div style={{ width: "100%" }}>
                    {<Carousel >
                        {product.images.map((img, i) =>
                            <Image key={i}
                                onClick={() => console.log('onClick')}
                                src={img}
                                aspectRatio={(16 / 9)} />)
                        }
                    </Carousel>
                    }
                </div>
                <div style={{ marginTop: "2%" }} >
                    <h2>{product.name}</h2>
                    <div className="add-cart">
                        <ButtonGroup style={{ margin: "2%" }} size="small" aria-label="small outlined button group">
                            <Button onClick={() => handleCount(false)}>-</Button>
                            <Button style={{ backgroundColor: "white", color: "black" }} disabled>{count}</Button>
                            <Button onClick={() => handleCount(true)}>+</Button>
                        </ButtonGroup>
                        <button style={{ margin: "2%" }} onClick={handleClick}> Add to cart</button>
                    </div>

                    <p style={{ fontSize: "150%" }}> <b>  ৳ {product.price}  </b></p>
                    <p style={{ marginTop: "1%" }}>{product.description}</p>

                </div>

            </div>
            )
            }
            {!(isPending && uIsPending) && <div style={{ margin: "0 auto" }}>
                <button style={{ marginTop: "5%" }} onClick={handleClickOpen} >Comment</button>
            </div>}
            {(user && product) && <CommentDialog open={open} handleClose={handleClose} user={user} product={product} oldComment={oldComment} />}
            {user && product && product.comments.length > 0 && <div>
                {
                    product.comments.map((comment, i) =>
                        <CommentBox comment={comment} product={product} handleEditComment={handleEditComment} reload={reload} user={user} />
                    )
                }
            </div>}
        </div >
    );
}

export default ProductDetails;