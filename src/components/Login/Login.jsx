import React, { useState } from 'react';
import './Login.css';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../lib/upload';

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });

    const [loading, setLoading] = useState(false);

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { loginEmail: email, loginPassword: password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imgUrl = await upload(avatar.file);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: []
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
            });

            toast.success("Account created! You can log in now!");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder='Email' name='loginEmail' />
                    <input type="password" placeholder='Password' name='loginPassword' />
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="Avatar" />
                        Upload an image
                    </label>
                    <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder='Username' name='username' />
                    <input type="text" placeholder='Email' name='email' />
                    <input type="password" placeholder='Password' name='password' />
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
}


export default Login;


// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../../lib/firebase';
// import { doc, setDoc } from 'firebase/firestore';
// import upload from '../../lib/upload';

// const Login = () => {
//     const [avatar, setAvatar] = useState({
//         file: null,
//         url: ""
//     });

//     const [loading, setLoading] = useState(false);

//     const handleAvatar = (e) => {
//         if (e.target.files[0]) {
//             setAvatar({
//                 file: e.target.files[0],
//                 url: URL.createObjectURL(e.target.files[0])
//             });
//         }
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         const formData = new FormData(e.target);
//         const { loginEmail: email, loginPassword: password } = Object.fromEntries(formData);

//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             toast.success("Welcome back!");
//         } catch (err) {
//             console.error(err);
//             toast.error(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         const formData = new FormData(e.target);
//         const { username, email, password } = Object.fromEntries(formData);

//         try {
//             const res = await createUserWithEmailAndPassword(auth, email, password);
//             const imgUrl = await upload(avatar.file);

//             await setDoc(doc(db, "users", res.user.uid), {
//                 username,
//                 email,
//                 avatar: imgUrl,
//                 id: res.user.uid,
//                 blocked: []
//             });

//             await setDoc(doc(db, "userchats", res.user.uid), {
//                 chats: []
//             });

//             toast.success("Account created! You can log in now!");
//         } catch (err) {
//             console.error(err);
//             toast.error(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-full h-full flex items-center gap-24">
//             <div className="flex-1 flex flex-col items-center gap-5">
//                 <h2>Welcome back,</h2>
//                 <form onSubmit={handleLogin} className="flex flex-col items-center gap-5 justify-center">
//                     <input type="text" placeholder="Email" name="loginEmail" className="p-5 border-none outline-none bg-[rgba(17,25,40,0.6)] text-white rounded-md" />
//                     <input type="password" placeholder="Password" name="loginPassword" className="p-5 border-none outline-none bg-[rgba(17,25,40,0.6)] text-white rounded-md" />
//                     <button disabled={loading} className="w-full p-5 border-none bg-blue-500 text-white rounded-md cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-blue-500/[0.6]">
//                         {loading ? "Loading" : "Sign In"}
//                     </button>
//                 </form>
//             </div>
//             <div className="h-4/5 w-0.5 bg-[#dddddd35]"></div>
//             <div className="flex-1 flex flex-col items-center gap-5">
//                 <h2>Create an Account</h2>
//                 <form onSubmit={handleRegister} className="flex flex-col items-center gap-5 justify-center">
//                     <label htmlFor="file" className="w-full flex items-center justify-between cursor-pointer underline">
//                         <img src={avatar.url || "./avatar.png"} alt="Avatar" className="w-12 h-12 rounded-md object-cover opacity-60" />
//                         Upload an image
//                     </label>
//                     <input type="file" id="file" className="hidden" onChange={handleAvatar} />
//                     <input type="text" placeholder="Username" name="username" className="p-5 border-none outline-none bg-[rgba(17,25,40,0.6)] text-white rounded-md" />
//                     <input type="text" placeholder="Email" name="email" className="p-5 border-none outline-none bg-[rgba(17,25,40,0.6)] text-white rounded-md" />
//                     <input type="password" placeholder="Password" name="password" className="p-5 border-none outline-none bg-[rgba(17,25,40,0.6)] text-white rounded-md" />
//                     <button disabled={loading} className="w-full p-5 border-none bg-blue-500 text-white rounded-md cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-blue-500/[0.6]">
//                         {loading ? "Loading" : "Sign Up"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Login;
