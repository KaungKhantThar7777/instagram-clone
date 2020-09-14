import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_AVATAR } from "../../graphql/mutations";
import handleImageUpload from "../../utils/handleImageUpload";
import { UserContext } from "../../App";

function ProfilePicture({
  isOwner,
  size,
  image = "https://robohash.org/hello",
}) {
  const classes = useProfilePictureStyles({ isOwner, size });
  const inputRef = React.useRef();
  const [updateAvatar] = useMutation(UPDATE_AVATAR);
  const [avatar, setAvatar] = React.useState(image);
  const { currentId } = React.useContext(UserContext);

  async function handleChangeImg(e) {
    const url = await handleImageUpload(e.target.files[0], "instagram-avatar");
    setAvatar(url);
    const variables = { id: currentId, profileImage: url };
    await updateAvatar({ variables });
  }

  const openFileInput = () => inputRef.current.click();

  return (
    <section className={classes.section}>
      <input
        style={{ display: "none" }}
        type="file"
        ref={inputRef}
        onChange={handleChangeImg}
      />
      {image ? (
        <div
          className={classes.wrapper}
          onClick={isOwner ? openFileInput : () => null}
        >
          <img src={avatar} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <Person classeName={classes.person} />
      )}
    </section>
  );
}

export default ProfilePicture;
