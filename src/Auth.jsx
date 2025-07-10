import { useEffect, useState } from 'react';
import { auth } from '../firebase';

export default function AuthState({ children }) {
    const [user, setUser] = useState(null);
    const [loding, setloading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChnaged((user) => {
            setUser(user);
            setloading(false);
        });
        return () => unsubscribe();

    });
    if (loading) {
        return <div>Loading....</div>
    }
    return children(user);
}