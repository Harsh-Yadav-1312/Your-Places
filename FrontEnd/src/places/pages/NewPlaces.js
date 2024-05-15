import React, { useContext } from "react";
import './PlaceForm.css';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";


const NewPlaces = () => {

    const auth = useContext(AuthContext);

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: '',
            isValid: false
        }
    }, false);

    const placeSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs);

        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);
            formData.append('image', formState.inputs.image.value);
            const response = await fetch('https://your-places-796g.vercel.app/api/places', {
                method: 'POST',
                headers: {Authorization: "Bearer " + auth.token},
                body: formData
            });

            const responseData = await response.json();
            console.log(responseData);
        }
        catch (err) {
            throw new Error('Something went wrong');
        }

    };

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="title"
                type="text"
                element="input"
                placeholder="Enter Title"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid Title"
                onInput={inputHandler}
            />
            <Input
                id="description"
                element="textarea"
                placeholder="Enter Description"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid Description (at least 5 characters)"
                onInput={inputHandler}
            />
            <Input
                id="address"
                element="textarea"
                placeholder="Enter Address"
                label="Address"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid address"
                onInput={inputHandler}
            />
            <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
            <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
        </form>

    );
}

export default NewPlaces;
