import React, { useContext } from "react";
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  Redirect,
} from "react-router-dom";
import FeedPage from "./pages/feed";
import ExplorePage from "./pages/explore";
import PostPage from "./pages/post";
import ProfilePage from "./pages/profile";
import EditProfilePage from "./pages/edit-profile";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import NotFoundPage from "./pages/not-found";
import PostModal from "./components/post/PostModal";
import { AuthContext } from "./auth";
import { useSubscription } from "@apollo/react-hooks";
import { ME } from "./graphql/subscription";
import LoadingScreen from "./components/shared/LoadingScreen";

export const UserContext = React.createContext();

function App() {
  const { authState } = useContext(AuthContext);
  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.uid : null;
  const variables = { userId };
  const { data, loading } = useSubscription(ME, { variables });

  const history = useHistory();
  const location = useLocation();
  const prevLocation = React.useRef(location);
  const modal = location.state?.modal;

  React.useEffect(() => {
    if (history.action !== "POP" && !modal) {
      prevLocation.current = location;
    }
  }, [history.action, modal, location]);

  if (loading) {
    return <LoadingScreen />;
  }

  const isModalOpen =
    modal && prevLocation.current.pathname !== location.pathname;

  if (!isAuth) {
    return (
      <Switch>
        <Route exact path="/accounts/login" component={LoginPage} />
        <Route exact path="/accounts/emailsignup" component={SignUpPage} />
        <Redirect to="/accounts/login" />
      </Switch>
    );
  }

  const me = data.users[0] || null;
  const currentId = me.id;
  return (
    <UserContext.Provider value={{ me, currentId }}>
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route exact path="/" component={FeedPage} />
        <Route path="/explore" component={ExplorePage} />
        <Route exact path="/p/:postId" component={PostPage} />
        <Route exact path="/:username" component={ProfilePage} />
        <Route exact path="/accounts/edit" component={EditProfilePage} />
        <Route exact path="/accounts/login" component={LoginPage} />
        <Route exact path="/accounts/emailsignup" component={SignUpPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
    </UserContext.Provider>
  );
}

export default App;
