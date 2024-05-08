import React, { useState, useContext } from "react";
import './Auth.css';
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";


const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = async event => {
        event.preventDefault();
        // console.log(formState.inputs);

        if (isLoginMode) {

            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                })

                const responseData = await response.json();

                console.log(responseData);
                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);
                auth.login(responseData.userId, responseData.token);
            }
            catch (err) {
                setIsLoading(false);
                setError(err.message || 'Something went wrong, please try again later');
                console.log(err);
            }

        }
        else {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const response = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    body: formData
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                console.log(responseData);

                setIsLoading(false);
                auth.login(responseData.userId, responseData.token);
            }
            catch (err) {
                setIsLoading(false);
                setError(err.message || 'Something went wrong, please try again later');
                console.log(err);
            }
        }
    }

    const switchModeHandler = () => {
        console.log('SWITCH');
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }

        setIsLoginMode(prevMode => !prevMode);
    }

    const errorHandler = () =>{
        setError(null);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>{isLoginMode ? 'Login' : 'Signup'} required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && <Input
                        element="input"
                        id="name"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid Name"
                        onInput={inputHandler}
                    />}
                    {!isLoginMode && <ImageUpload id='image' center errorText="Please provide an image" onInput={inputHandler} />}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid Email address"
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter valid Password with atleast 6 characters"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>

                <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </React.Fragment>
    );
}

export default Auth;