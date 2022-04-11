import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import app from "./firebase.init";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const inputFeild = (event) => {
    setEmail(event.target.value);
  };

  const passField = (event) => {
    setPass(event.target.value);
  };

  const handleRegister = (event) => {
    setRegister(event.target.checked);
  };

  const submitButton = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (!/(?=.*[!@#$%^&*])/.test(pass)) {
      setError("Need a special cherecter");
      return;
    }

    setValidated(true);
    setError("");

    if (register) {
      signInWithEmailAndPassword(auth, email, pass)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPass("");
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, pass)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPass("");
          verifyEmail();
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    }
    event.preventDefault();
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent");
    });
  };

  const handleForgetPass = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("Sent mail");
    });
  };

  return (
    <div>
      <h2 className="text-primary mt-4" style={{ textAlign: "center" }}>
        {register ? "Log In" : "Please Register"}
      </h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={submitButton}
        className="container mt-4 w-50"
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onBlur={inputFeild}
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Email.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onBlur={passField}
            type="password"
            placeholder="Password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            onChange={handleRegister}
            type="checkbox"
            label="Already register?"
          />
        </Form.Group>
        <p className="text-danger">{error}</p>
        <p className="text-danger">{error.message}</p>
        <Button variant="primary" type="submit">
          {register ? "Log In" : "Register"}
        </Button>
        <Button onClick={handleForgetPass} variant="link">
          Forget Password
        </Button>
      </Form>
    </div>
  );
}

export default App;
