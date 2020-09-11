import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";

function ProfilePicture({
  isOwner,
  size,
  image = "https://robohash.org/hello",
}) {
  const classes = useProfilePictureStyles({ isOwner, size });

  return (
    <section className={classes.section}>
      {image ? (
        <div className={classes.wrapper}>
          <img src={image} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <Person classeName={classes.person} />
      )}
    </section>
  );
}

export default ProfilePicture;
