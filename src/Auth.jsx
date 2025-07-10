import { useEffect, useState } from 'react';
import { auth } from './firebase/firebase';

export default function AuthState({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }
    return children(user);
}