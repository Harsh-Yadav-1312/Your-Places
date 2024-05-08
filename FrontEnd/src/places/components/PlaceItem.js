import React, {useState, useContext} from "react";

import './PlaceItem.css';
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import '../../shared/components/FormElements/Button.css';
import Modal from "../../shared/components/UIElements/Modal";
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const PlaceItem = props => {
    const auth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState();

    const openMapHandler = () => setShowMap(true);
    
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    }

    const cancelDeleteHandler = () =>{
        setShowConfirmModal(false);
    }

    const confirmDeleteHandler = async () =>{
        console.log("Deleting...");
        setShowConfirmModal(false);
        let responseData;
        try{
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/api/places/${props.id}`,
            {
                method: 'DELETE',
                body: null,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            });
            responseData = await response.json();
            if(!response.ok){
                throw new Error('Something went wrong');
            }
            console.log(responseData);
            props.deletePlace(props.id);
            setIsLoading(false);
        }
        catch(err){
            setError(err.message || 'Can not delete, Something went wrong')
            throw new Error('Failed to delete');
        }
    }

    const errorHandler = () =>{
        setError(null);
    }

    return (
    <React.Fragment>
        {<ErrorModal error={error} onClear={errorHandler} />}
        <Modal 
        show={showMap} 
        onCancel={closeMapHandler} 
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        >
            {/* props.children */}
            <div className="map-container">
                <Map center={props.coordinates} zoom={16} />
            </div>
        </Modal>
        <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you Sure?"
        footerClass="place-item__modal-actions"
        footer={
            <React.Fragment>
                <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
            </React.Fragment>
        }
        >
            <p>Do you want to proceed and delete this place?</p>
        </Modal>
    
    <li className="place-item">
        <Card className="place-item__content">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
        </div>
        <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
        </div>
        <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.userId === props.creatorId && 
            
            <Button to={`/places/${props.id}`}>EDIT</Button>
            }
             {auth.userId === props.creatorId && 
            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
             }
        </div>
        </Card>
    </li>
    </React.Fragment>
    );
}

export default PlaceItem;