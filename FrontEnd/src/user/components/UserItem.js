import React from "react";
import './UserItem.css';
import Avatar from "../../shared/components/UIElements/Avatar";
import {Link} from 'react-router-dom';
import Card from "../../shared/components/UIElements/Card";

const UserItem = props => {
    return (
        <li className="user-item">
            <div className="user-item__image">
                <Card className="user-item__content">
                    <Link to={`/${props.id}/places`}>
                        <div className="user-item__image">
                            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
                        </div>
                        <div className="user-item__info">
                            <h2>{props.name}</h2>
                            <p className="user-item__places">{props.placeCount} {props.placeCount ===1? ' Place' : ' Places'}</p>
                        </div>
                    </Link>
                </Card>
            </div>
        </li>
    )
}

export default UserItem;