import { useMutation } from "@apollo/react-hooks";
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Zoom,
} from "@material-ui/core";
import { ArrowBackIos, PinDrop } from "@material-ui/icons";
import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { UserContext } from "../../App";
import { CREATE_POST } from "../../graphql/mutations";
import { useAddPostDialogStyles } from "../../styles";
import handleImageUpload from "../../utils/handleImageUpload";
import serialize from "../../utils/serialize";

const initialState = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const AddPostDialog = ({ media, handleClose }) => {
  const classes = useAddPostDialogStyles();
  const { me, currentId } = React.useContext(UserContext);
  const [location, setLocation] = React.useState("");
  // Create a Slate editor object that won't change across renders.
  const editor = React.useMemo(() => withReact(createEditor()), []);
  // Keep track of state for the value of the editor.
  const [value, setValue] = React.useState(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createPost] = useMutation(CREATE_POST);

  const handleSharePost = async () => {
    setIsSubmitting(true);
    const url = await handleImageUpload(media);
    const variables = {
      userId: currentId,
      caption: serialize({ children: value }),
      location,
      media: url,
    };

    await createPost({ variables });
    setIsSubmitting(false);
    handleClose();
  };
  return (
    <Dialog open fullScreen TransitionComponent={Zoom} onClose={handleClose}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <ArrowBackIos onClick={handleClose} />
          <Typography variant="body1" className={classes.title} align="center">
            New Post
          </Typography>
          <Button
            color="primary"
            disabled={isSubmitting}
            onClick={handleSharePost}
          >
            Share
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Paper className={classes.paper}>
        <Avatar src={me.profile_image} />
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Editable
            placeholder="Write your caption..."
            className={classes.editor}
          />
        </Slate>
        <Avatar
          src={URL.createObjectURL(media)}
          variant="square"
          className={classes.avatarLarge}
        />
      </Paper>
      <TextField
        className={classes.input}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        placeholder="Location"
        InputProps={{
          classes: {
            root: classes.root,
            input: classes.input,
            underline: classes.underline,
          },
          startAdornment: (
            <InputAdornment>
              <PinDrop />
            </InputAdornment>
          ),
        }}
      />
    </Dialog>
  );
};

export default AddPostDialog;
