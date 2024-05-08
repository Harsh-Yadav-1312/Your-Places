import React from "react";
import './Avatar.css';

const Avatar = props => {
    return (
        <div className={`avatar ${props.className}`}  style={props.style}>
            <img
            src={props.image}
            alt={props.name}
            style={{ width: props.width, height: props.width }}
            />
        </div>
    );
}

export default Avatar;

//Presentational Components: rendering
//Stateful Components