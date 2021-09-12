import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Divider, ListItemText } from '@material-ui/core';
import MenuComment from './MenuComment';
import { useState } from 'react';


const CommentBox = ({ comment, product, handleEditComment, reload, user }) => {
    const [isPending, setIsPending] = useState(false)
    const [isError, setIsError] = useState(null)

    const deleteComment = () => {
        console.log("deleting comment")
        setIsPending(true)
        fetch('/data/products/comment/delete/' + product._id, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment)
        }).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(res => {
                reload()
                setIsError(res.data)
                setIsPending(false)
            }));
    }
    const configTime = (timestamp) => {
        const date = new Date(timestamp);
        let dateString = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
        dateString += ' @ ' + new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hour12: true }).format(date)

        return dateString;
    }
    return (
        <div>
            {user.email === comment.email &&
                <MenuComment style={{
                    position: "fixed",
                    right: "0%",
                    top: "0%",
                }} deleteComment={deleteComment} editComment={handleEditComment} comment={comment} user={user} />}
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <PersonIcon />
                    </Avatar>
                </ListItemAvatar>
                <div>
                    <div><b>{`${comment.username} [${comment.email}]`}</b></div>
                    <div style={{ fontSize: "90%" }}>{configTime(comment.timestamp)}</div>
                </div>
            </ListItem>
            <ListItem >
                {comment.text}
            </ListItem>
            <Divider style={{ marginBottom: "1em" }} />
        </div>

    )
}
export default CommentBox;