import React from "react";
import './UsersList.css';
import UserItem from "./UserItem";

const UsersList = props => {

    if(props.items.length === 0){
        return (
            <div className="center">
                <h2>No User Found</h2>
            </div>
        )
    }
    else{
        return(
            <ul>
               {
                props.items.map( user => 
                    <UserItem 
                    key={user.id}
                    id={user.id}
                    name = {user.name}
                    image = {user.imageUrl}
                    placeCount = {user.places.length}
                    />
                    )
               }
            </ul>
        )
    }
     
    
}

export default UsersList;