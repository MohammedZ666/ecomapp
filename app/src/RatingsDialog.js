import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'; import ReactStars from 'react-stars'
import { useState } from 'react';

//TODO:
const RatingsDialog = ({ open, handleClose, user, product }) => {
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false)
    const [comment, setComment] = useState({
        text: "",
        //rating: 0,
        username: user.username,
        timestamp: (new Date())
    })
    const ratingChanged = (newRating) => {
        let commentTemp = { ...comment }
        commentTemp.rating = newRating
        setComment(commentTemp)
    };
    const textChanged = (newText) => {
        let commentTemp = { ...comment }
        commentTemp.text = newText
        setComment(commentTemp)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true)
        fetch('/data/products/comment/' + product._id, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment)
        }).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(res => {

                setIsError(res.data)
                setIsPending(false)
            }));
    }
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Comment</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your comment and rating are extremely valuable to us. Please give us your feedback regarding the vendor and the product.
                </DialogContentText>
                <p> <b>Your rating:</b></p>
                {/* <ReactStars
          count={5}
          value={comment.rating}
          onChange={ratingChanged}
          size={48}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="#ffd700"
        /> */}
                <TextField
                    autoFocus
                    disabled={isPending}
                    margin="normal"
                    id="comment"
                    label="Your comment"
                    type="text"
                    onChange={(e) => {
                        textChanged(e.target.value)
                    }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <button onClick={handleClose}>
                    Cancel
                </button>
                <button disabled={isPending} onClick={handleSubmit}>
                    Comment
                </button>


            </DialogActions>
        </Dialog>)

}
export default RatingsDialog;