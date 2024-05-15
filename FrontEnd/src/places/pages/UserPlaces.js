import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from 'react-router-dom';
// import axios from "axios";


// const DUMMY_PLACES = [
//     {
//        id: 'p1',
//        title: 'Statue of Unity',
//        description: 'Tallest Statue',
//        imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/65/2a/08/world-s-tallest-statue.jpg?w=1200&h=-1&s=1',
//         address: 'Sardar Sarovar Dam, Statue of Unity Rd, Kevadia, Gujarat 393155',
//         location: {lat: 21.8380234 , lng: 73.7164979},
//         creator: 'u1'
//     },
//     {
//        id: 'p2',
//        title: 'Vivekananda Rock Memorial',
//        description: 'Rock Statue of Swami Vivekananda',
//        imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipORvpqm0sdJZYfvmVzJYKMDhimwUM7snItkH96y=w408-h302-k-no',
//         address: 'Kanyakumari, Tamil Nadu',
//         location: {lat: 8.0780669 , lng: 77.5528242},
//         creator: 'u2'
//     },
// ];

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState([]);

    const userId = useParams().creatorId;
    // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    console.log(userId);

    useEffect(() => {
        const fetchPlaces = async () => {
            let responseData;
            try {
                // const response = await axios.get(`http://localhost:5000/api/places/user/${userId}`)
                // .then((response) =>{
                //     console.log(response.data)
                //     responseData = response.json();
                //     setLoadedPlaces(responseData.data);
                // });
                    // console.log(response);
                // responseData = await response.json();
                const response = await fetch(`https://your-places-796g.vercel.app/api/places/user/${userId}`);
                
                responseData = await response.json();
                console.log(responseData);
                setLoadedPlaces(responseData.places);
                
                if(!response.ok){
                    throw new Error('Failed to get places');
                }

            }
            catch (err) {
                throw new Error('Failed to get the places')
            }
        }
        fetchPlaces();

    }, [userId]);

    const placeDeletedHandler = (pId) =>{
        let updatedPlaces = loadedPlaces;
        updatedPlaces = updatedPlaces.filter(place => place.id !== pId);
        setLoadedPlaces(updatedPlaces);
    }

    return (
        <React.Fragment>
            {loadedPlaces && <PlaceList items={loadedPlaces} delete={placeDeletedHandler} />}
        </React.Fragment>
    );
}

export default UserPlaces;
