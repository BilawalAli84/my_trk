import useAuth from 'app/hooks/useAuth';
import { useState, useEffect } from 'react';
// import { flat } from 'app/utils/utils';
import { Navigate, useLocation } from 'react-router-dom';
// import AllPages from '../routes';

// const userHasPermission = (pathname, user, routes) => {
//   if (!user) {
//     return false;
//   }
//   const matched = routes.find((r) => r.path === pathname);

//   const authenticated =
//     matched && matched.auth && matched.auth.length ? matched.auth.includes(user.role) : true;
//   return authenticated;
// };

const AuthGuard = ({ children }) => {
  let {
    isAuthenticated,
    user
  } = useAuth();
  var authenticated = false;
  console.log('AuthGuard state ' + authenticated);

  const [stateAuth, setStateAuth] = useState(true);
  // useEffect(() => {
  //   // const user = JSON.parse(window.localStorage.getItem('user'));
  //   // // console.log("AuthGuard User:" + user);
  //   // // console.log("AuthGuard Token:" + accessToken);


  //   // if (accessToken && user) {
  //   //   setState(true);
  //   //   console.log("Hello");
  //   // }
  //   authenticated = true;

  //   setStateAuth(false);
  //   console.log('Helo');

  // }, [])
  const accessToken = window.localStorage.getItem('accessToken');
  
  const { pathname } = useLocation();

  //   const routes = flat(AllPages);

  //   const hasPermission = userHasPermission(pathname, user, routes);
  //   let authenticated = isAuthenticated && hasPermission;

  // // IF YOU NEED ROLE BASED AUTHENTICATION,
  // // UNCOMMENT ABOVE LINES
  // // AND COMMENT OUT BELOW authenticated VARIABLE

  // let authenticated = isAuthenticated;
  // alert(authenticated);
  return (
    <>
      {accessToken!=null ? (
        children
      ) : (
        <Navigate replace to="/session/signin" state={{ from: pathname }} />
      )}
    </>
  );
};

export default AuthGuard;
