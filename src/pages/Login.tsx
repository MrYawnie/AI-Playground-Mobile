import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonPopover,
} from "@ionic/react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [error2, setError2] = useState("");
    const [showPopover, setShowPopover] = useState(false);

    const history = useHistory();

    const handleLogin = async () => {
        setError("");
        setError2("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push("/tab1");
        } catch (error) {
            console.error("Error signing in:", error);
            setError("Error signing in, please try again. " + error.message);
        }
    };

    const handleRegister = async () => {
        setError("");
        setError2("");
        setUsername("");
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            if (user) {
                setShowPopover(true);
            }
        } catch (error) {
            console.error("Error creating account:", error);
            setError2("Error creating account, please try again. " + error.message);
        }
    };

    const handleUsernameSubmit = async () => {
        if (!username) {
            setError2("Please enter a username.");
            return;
        }
        try {
            const user = auth.currentUser;
            await updateProfile(user, { displayName: username });
            setShowPopover(false);
            history.push("/tab1");
        } catch (error) {
            console.error("Error updating username:", error);
            setError2("Error updating username, please try again. " + error.message);
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="login-container">
                    <br />
                    <h2>Login / Register</h2>
                    <IonInput
                        type="email"
                        aria-label="Email"
                        label="Email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    />
                    <IonInput
                        type="password"
                        aria-label="Password"
                        label="Password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                    />
                    {error && <p className="error">{error}</p>}
                    <IonButton expand="block" color="success" onClick={handleLogin}>
                        Login
                    </IonButton>
                    <IonButton expand="block" onClick={handleRegister}>
                        Register
                    </IonButton>
                    {error2 && <p className="error">{error2}</p>}
                </div>

                <IonPopover
                    isOpen={showPopover}
                    onDidDismiss={() => setShowPopover(false)}
                >
                    <div className="username-popover">
                        <h3>Choose a Username</h3>
                        <IonInput
                            type="text"
                            aria-label="Username"
                            label="Username"
                            value={username}
                            onIonChange={(e) => setUsername(e.detail.value!)}
                        />
                        <IonButton expand="block" onClick={handleUsernameSubmit}>
                            Submit
                        </IonButton>
                    </div>
                </IonPopover>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;