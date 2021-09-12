import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'; import ReactStars from 'react-stars'
import { useState } from 'react';


const CommentDialog = ({ open, handleClose, user, product, oldComment }) => {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false)
  const [comment, setComment] = useState({
    text: "",
    timestamp: (new Date()),
    username: user.username,
    email: user.email
  })
  const textChanged = (newText) => {
    let commentTemp = { ...comment }
    commentTemp.text = newText
    setComment(commentTemp)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(comment)
    console.log(user)
    setIsPending(true)
    // It returns false for null, undefined, 0, 000, "", false.
    // It returns true for all string values other than the empty string (including strings like "0" and " ")
    if (Boolean(oldComment)) {
      console.log("in here")
      // Code here
      let commentTemp = { ...comment }
      commentTemp.oldText = oldComment.text
      commentTemp.timestamp = oldComment.timestamp
      fetch('/data/products/comment/edit/' + product._id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentTemp)
      }).then(response =>
        response.json().then(data => ({
          data: data,
          status: response.status
        })
        ).then(res => {

          setIsError(res.data)
          setIsPending(false)
          handleClose()
        }));
    }


    else fetch('/data/products/comment/' + product._id, {
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
        handleClose()
      }));
  }
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Comment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your email will be publicly visible after you comment.
        </DialogContentText>
        <TextField
          autoFocus
          defaultValue={oldComment === null ? "" : oldComment.text}
          disabled={isPending}
          margin="normal"
          id="comment"
          label="Your comment"
          type="text"
          onChange={(e) => {
            textChanged(e.target.value)
          }}
          multiline
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
export default CommentDialog;