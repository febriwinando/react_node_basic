// // src/components/Home.js
// import React, { useEffect, useState } from 'react';

// const Home = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/data'); // Pastikan endpoint ini sesuai dengan server.js
//                 const result = await response.json();
//                 console.log('Data fetched from API:', result); // Log untuk memastikan data diambil dengan benar
//                 setUsers(result);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     return (
//         <div>
//             <h2>Data Pengguna</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Nama</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((user) => (
//                         <tr key={user.id}> {/* Pastikan 'id' sesuai dengan kolom primary key di tabel user */}
//                             <td>{user.id}</td> {/* Ganti sesuai dengan kolom id di tabel Anda */}
//                             <td>{user.nama}</td> {/* Ganti sesuai dengan kolom nama di tabel Anda */}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Home;


// src/components/Home.js
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5001'); // Sesuaikan dengan URL backend Anda

// const Home = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         // Mengambil data pengguna dari server saat komponen pertama kali dimuat
//         const fetchUsers = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/data');
//                 const result = await response.json();
//                 setUsers(result);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchUsers();

//         // Mendengarkan event 'new_user' dari server untuk pembaruan data pengguna
//         socket.on('new_user', (newUser) => {
//             setUsers((prevUsers) => [...prevUsers, newUser]);
//         });

//         // Cleanup untuk mencegah multiple event listeners saat komponen di-unmount
//         return () => {
//             socket.off('new_user');
//         };
//     }, []);

//     return (
//         <div>
//             <h2>Data Pengguna</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Nama</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((user) => (
//                         <tr key={user.id}>
//                             <td>{user.id}</td>
//                             <td>{user.nama}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Home;
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5001');

// const Home = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/data');
//                 const result = await response.json();
//                 setUsers(result);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchUsers();

//         socket.on('new_user', (newUser) => {
//             setUsers((prevUsers) => [...prevUsers, newUser]);
//         });

//         return () => {
//             socket.off('new_user');
//         };
//     }, []);

//     return (
//         <div class="container">
//             <h2>Data Pengguna</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Nama</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((user) => (
//                         <tr key={user.id}>
//                             <td>{user.id}</td>
//                             <td>
//                                 <Link to={`/user/${user.id}`}>{user.nama}</Link>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const Home = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/data');
            const result = await response.json();
            setUsers(result);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();

        socket.on('new_user', (newUser) => {
            setUsers((prevUsers) => [...prevUsers, newUser]);
        });

        socket.on('user_count_updated', () => {
            fetchUsers(); // Ambil data terbaru
        });

        return () => {
            socket.off('new_user');
            socket.off('user_count_updated');
        };
    }, []);

    return (
        <div className="container">
            <h2>Data Pengguna</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                <Link to={`/user/${user.id}`}>{user.nama}</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
