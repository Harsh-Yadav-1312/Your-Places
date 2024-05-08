import React from "react";

import './PlaceList.css';
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";

const PlaceList = props => {

    if(props.items.length === 0){
        return (
            <div className="place-list center">
            <Card>
                <h2>No Places Found. Create one?</h2>
                <button>Share Place</button>
            </Card>
            </div>
        );
    }
    
    return (<ul className="place-list">
        {props.items.map(place => 
        <PlaceItem
            key={place.id}
            id={place.id}
            image={place.imageUrl}
            title={place.title}
            description={place.description}
            address={place.address}
            coordinates={place.location}
            creatorId={place.creator}
            deletePlace={props.delete}
        />)
    }
    </ul>);
    
}

export default PlaceList;