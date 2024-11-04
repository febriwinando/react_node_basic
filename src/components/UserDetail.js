import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/user/${id}`);
                if (response.ok) {
                    const result = await response.json();
                    setUser(result);
                } else {
                    console.error('Error fetching user:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <p>Loading user details...</p>;
    }

    if (!user) {
        return <p>User not found</p>;
    }

    return (
        <div>
            <h2>Detail Pengguna</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Nama:</strong> {user.nama}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Alamat:</strong> {user.alamat}</p>


            {/* Tambahkan field lain sesuai kebutuhan */}
        </div>
    );
};

export default UserDetails;
