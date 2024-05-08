import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const Users = () => {
    // const USERS = [
    //     {id:'u1', name: 'Harish', image:'https://cdn-icons-png.flaticon.com/128/552/552848.png', places: 1},
    //     {id:'u2', name: 'Manish', image:'https://cdn-icons-png.flaticon.com/128/552/552848.png', places: 1},
    //     {id:'u3', name: 'Rakesh', image:'https://cdn-icons-png.flaticon.com/128/552/552848.png', places: 0},
    //     {id:'u4', name: 'Ajay', image:'https://cdn-icons-png.flaticon.com/128/552/552848.png', places:0}
    // ];

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedUser, setLoadedUser] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const responseData = await response.json();

                if (!responseData) {
                    throw new Error(responseData.message);
                }
                console.log(responseData.users);
                setLoadedUser(responseData.users);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                setError(err.message || 'Something went wrong, please try again later');
                console.log(err);
            }
        };

        sendRequest();
    }, []);

    const errorHandler = () => {
        setError(null);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUser && <UsersList items={loadedUser} />}
        </React.Fragment>
    );
}

export default Users;