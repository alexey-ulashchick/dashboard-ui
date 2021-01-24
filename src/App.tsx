import './App.css';
import { SignInUserRequest } from '@alexey-ulashchick/dashboard-protos/protos/AuthService_pb';
import { AuthServiceClient } from '@alexey-ulashchick/dashboard-protos/protos/AuthService_pb_service';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

function App() {

  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (response.code) {
      console.log(response);
      return;
    }

    const resp = response as GoogleLoginResponse;
    const grpcSingInRequest = new SignInUserRequest();

    grpcSingInRequest.setEmail(resp.getBasicProfile().getEmail());
    grpcSingInRequest.setFirstName(resp.getBasicProfile().getGivenName());
    grpcSingInRequest.setLastName(resp.getBasicProfile().getFamilyName());
    grpcSingInRequest.setImageUrl(resp.getBasicProfile().getImageUrl());

    const client = new AuthServiceClient("http://localhost:8080");

    client.signIn(grpcSingInRequest, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(response?.getJwttoken());
    });
  };

  const onFailure = (failure: {}) => {
    console.error(failure);
  };

  return (
    <div className="App">
      <GoogleLogin
        clientId="631305080500-ikvt7r4vgsnsicvc1mo810atleqcgvu2.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={false}
      />
    </div>
  );
}

export default App;
