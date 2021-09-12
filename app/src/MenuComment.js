import { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = [
    'edit',
    'delete'
];


const MenuComment = ({ deleteComment, editComment, comment, user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
        console.log(anchorEl)
    };

    const handleClose = (option) => {
        setAnchorEl(null);
        console.log(option)
        if (option === 'delete') {
            console.log("clicked delete")
            deleteComment();
        }
        if (option === 'edit') {
            editComment(comment)
        }
    };

    return (
        <div style={{
            position: "relative"
        }}>
            <div style={{
                position: "absolute",
                top: "1em",
                right: "1em",
                zIndex: "1"

            }}>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ backgroundColor: "white" }}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    {options.map((option) => (
                        <MenuItem key={option}
                            selected={option === 'Pyxis'}
                            onClick={() => handleClose(option)}  >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>

        </div>
    );
}
export default MenuComment;