import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import './PlaceForm.css';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";


// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Statue of Unity',
//         description: 'Tallest Statue',
//         imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/65/2a/08/world-s-tallest-statue.jpg?w=1200&h=-1&s=1',
//         address: 'Sardar Sarovar Dam, Statue of Unity Rd, Kevadia, Gujarat 393155',
//         location: { lat: 21.8380234, lng: 73.7164979 },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: 'Vivekananda Rock Memorial',
//         description: 'Rock Statue of Swami Vivekananda',
//         imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipORvpqm0sdJZYfvmVzJYKMDhimwUM7snItkH96y=w408-h302-k-no',
//         address: 'Kanyakumari, Tamil Nadu',
//         location: { lat: 8.0780669, lng: 77.5528242 },
//         creator: 'u2'
//     },
// ];

const UpdatePlaces = () => {

    const auth = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(true);
    const [editPlace, setEditPlace] = useState({});
    const [error, setError] = useState();

    const placeId = useParams().placeId;
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
        const updatePlace = async () => {
            let responseData;
            setIsLoading(true);
            try {
                const response = await fetch(`https://your-places-796g.vercel.app/api/places/${placeId}`);
                responseData = await response.json();
                console.log(responseData.place);
                if (!response.ok) {
                    throw new Error('Something Went wrong, Please Try again');
                }
                setEditPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
                setIsLoading(false);

            }
            catch (err) {
                setError(err.message || 'Something went wrong');
                throw new Error('Failed to Update place');
            }

        }
        updatePlace();
    }, [placeId, setFormData]);


    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    


    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        let responseData;
        try{
            setIsLoading(true);
            const response = await fetch(`https://your-places-796g.vercel.app/api/places/${placeId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + auth.token
                },
                body: JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                })
            });
            responseData = response.json();
            if(!response.ok){
                throw new Error('Can not Submit the form');
            }
            console.log(responseData.place);
            setIsLoading(false);
            history.push('/' + auth.userId + '/places');
        }
        catch(err){
            setError(err.message || 'Something went wrong');
            throw new Error('Failed to update the place');
        }
    }

    if (!editPlace && !error) {
        return (
            <div className="center">
                <h2>Could NOT find any place</h2>
            </div>);
    }

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner/>
            </div>
        );
    }

    const errorHandler = () =>{
        setError(null);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            {!isLoading && editPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                    initialValue={formState.inputs.title.value}
                    initialValid={formState.inputs.title.isValid}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description with atleast 5 characters"
                    onInput={inputHandler}
                    initialValue={formState.inputs.description.value}
                    initialValid={formState.inputs.description.isValid}
                />
                <Button type="submit" disabled={!formState.isValid}>Update Place</Button>
            </form>}
        </React.Fragment>
    );

}

export default UpdatePlaces;
