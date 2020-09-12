import React, { useContext, useState } from "react";
import { useNavbarStyles, WhiteTooltip, RedTooltip } from "../../styles";
import {
  AppBar,
  Hidden,
  InputBase,
  Avatar,
  Grid,
  Typography,
  Fade,
  Zoom,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo.png";
import {
  LoadingIcon,
  AddIcon,
  HomeActiveIcon,
  HomeIcon,
  ExploreIcon,
  ExploreActiveIcon,
  LikeIcon,
  LikeActiveIcon,
} from "../../icons";
import { useEffect } from "react";
import NotificationTooltip from "../notification/NotificationTooltip";
import NotificationList from "../notification/NotificationList";
import { useNProgress } from "@tanem/react-nprogress";
import { useLazyQuery } from "@apollo/react-hooks";
import { SEARCH_USERS } from "../../graphql/queries";
import { UserContext } from "../../App";

function Navbar({ minimalNavbar }) {
  const [loading, setLoading] = useState(true);
  const classes = useNavbarStyles();
  const history = useHistory();
  const path = history.location.pathname;

  useEffect(() => {
    setLoading(false);
  }, [path]);
  return (
    <>
      <Progress isAnimating={loading} />
      <AppBar className={classes.appBar}>
        <section className={classes.section}>
          <Logo />
          {!minimalNavbar && (
            <>
              <Search history={history} />
              <Links path={path} />
            </>
          )}
        </section>
      </AppBar>
    </>
  );
}

function Logo() {
  const classes = useNavbarStyles();
  return (
    <div className={classes.logoContainer}>
      <Link to="/">
        <div className={classes.logoWrapper}>
          <img src={logo} alt="Logo" className={classes.logo} />
        </div>
      </Link>
    </div>
  );
}

function Search({ history }) {
  const classes = useNavbarStyles();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasResults = Boolean(query) && results.length > 0;
  const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);
  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    const variables = { query: `%${query}%` };
    searchUsers({ variables });
    if (data) {
      setResults(data.users);
      setLoading(false);
    }
    // setResults(Array.from({ length: 5 }, () => getDefaultUser()));
  }, [query, data, searchUsers]);

  const handleClear = () => setQuery("");
  return (
    <Hidden xsDown>
      <WhiteTooltip
        arrow
        TransitionComponent={Fade}
        interactive
        open={hasResults}
        title={
          hasResults && (
            <Grid className={classes.resultContainer} container>
              {results.map((result) => (
                <Grid
                  key={result.id}
                  item
                  className={classes.resultLink}
                  onClick={() => history.push(`/${result.username}`)}
                >
                  <div className={classes.resultWrapper}>
                    <div className={classes.avatarWrapper}>
                      <Avatar src={result.profile_image} alt="user avatar" />
                    </div>
                    <div className={classes.nameWrapper}>
                      <Typography variant="body1">{result.username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )
        }
      >
        <InputBase
          className={classes.input}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Search"
          startAdornment={<span className={classes.searchIcon} />}
          endAdornment={
            loading ? (
              <LoadingIcon />
            ) : (
              <span className={classes.clearIcon} onClick={handleClear} />
            )
          }
        />
      </WhiteTooltip>
    </Hidden>
  );
}
function Links({ path }) {
  const classes = useNavbarStyles();
  const [showList, setShowList] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const { me } = useContext(UserContext);

  useEffect(() => {
    const timeout = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const handleToggleList = () => setShowList((prev) => !prev);

  const handleHideTooltip = () => setShowTooltip(false);

  const handleCloseList = () => setShowList(false);

  return (
    <div className={classes.linksContainer}>
      {showList && <NotificationList handleCloseList={handleCloseList} />}
      <div className={classes.linksWrapper}>
        <Hidden xsDown>
          <AddIcon />
        </Hidden>
        <Link to="/">{path === "/" ? <HomeActiveIcon /> : <HomeIcon />}</Link>
        <Link to="/explore">
          {path === "/explore" ? <ExploreActiveIcon /> : <ExploreIcon />}
        </Link>
        <RedTooltip
          arrow
          interactive
          title={<NotificationTooltip />}
          open={showTooltip}
          onOpen={handleHideTooltip}
          TransitionComponent={Zoom}
        >
          <div className={classes.notifications} onClick={handleToggleList}>
            {showList ? <LikeActiveIcon /> : <LikeIcon />}
          </div>
        </RedTooltip>
        <Link to={`/${me.username}`}>
          <div
            className={path === `/${me.username}` ? classes.profileActive : ""}
          ></div>
          <Avatar src={me.profile_image} className={classes.profileImage} />
        </Link>
      </div>
    </div>
  );
}

function Progress({ isAnimating }) {
  const classes = useNavbarStyles();
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });
  return (
    <div
      className={classes.progressContainer}
      style={{
        opacity: isFinished ? 0 : 1,
        transtion: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        className={classes.progressBar}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
      >
        <div className={classes.progressBackground} />
      </div>
    </div>
  );
}

export default Navbar;
