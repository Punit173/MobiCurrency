import React, { useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { openDB } from "idb";
import { Link, useNavigate } from "react-router-dom";
import { FaDollarSign, FaExchangeAlt, FaRegHandPointRight } from "react-icons/fa";

// Initialize IndexedDB
const dbPromise = openDB("ZeroKnowledgeAuthDB", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("keys")) {
            db.createObjectStore("keys");
        }
    },
});

// Utility functions for encryption and decryption
const deriveKey = async (password, salt) => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
};

const encryptData = async (data, password) => {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );
    return {
        encryptedData: Array.from(new Uint8Array(encrypted)),
        salt: Array.from(salt),
        iv: Array.from(iv),
    };
};

const decryptData = async (encryptedData, password, salt, iv) => {
    const key = await deriveKey(password, new Uint8Array(salt));
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(iv),
        },
        key,
        new Uint8Array(encryptedData)
    );
    return decrypted;
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to generate public and private keys
    const generateKeys = async (encryptionPassword) => {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-PSS",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["sign", "verify"]
        );

        // Export and save the public key
        const publicKeyPem = await window.crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        );
        const publicKeyBase64 = btoa(
            String.fromCharCode(...new Uint8Array(publicKeyPem))
        );
        const publicKeyPemString = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64
            .match(/.{1,64}/g)
            .join("\n")}\n-----END PUBLIC KEY-----`;

        // Store the public key in state
        setPublicKey(publicKeyPemString);

        // Export the private key
        const privateKeyPem = await window.crypto.subtle.exportKey(
            "pkcs8",
            keyPair.privateKey
        );

        // Encrypt the private key with the user's password
        const { encryptedData, salt, iv } = await encryptData(
            privateKeyPem,
            encryptionPassword
        );

        // Store the encrypted private key, salt, and iv in IndexedDB
        const db = await dbPromise;
        await db.put("keys", { encryptedData, salt, iv }, email);
    };
    const navigate = useNavigate();

    // Handle signup
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const encryptionPassword = prompt(
                "Enter a password to secure your private key:"
            );
            if (!encryptionPassword) {
                throw new Error("Password is required to secure your private key.");
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await generateKeys(encryptionPassword);
            const setDocWithTimeout = (docRef, data, timeout) => {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("setDoc operation timed out")),
                        timeout
                    )
                );
                return Promise.race([setDoc(docRef, data), timeoutPromise]);
            };

            try {
                await setDocWithTimeout(
                    doc(db, "users", userCredential.user.uid),
                    {
                        email: email,
                        publicKey: publicKey,
                    },
                    5000
                );
                console.log("Document successfully written");
            } catch (error) {
                if (error.message === "setDoc operation timed out") {
                    console.error("The setDoc operation took too long and was aborted.");
                } else {
                    console.error("Error writing document:", error);
                }
            }

            setLoading(false);
            alert("Signup successful!");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            const encryptionPassword = prompt(
                "Enter your password to unlock your private key:"
            );
            if (!encryptionPassword) {
                throw new Error("Password is required to unlock your private key.");
            }

            const db = await dbPromise;
            const storedKey = await db.get("keys", email);
            if (!storedKey) {
                throw new Error(
                    "Private key not found on this device. Please sign up or use the original device."
                );
            }

            const { encryptedData, salt, iv } = storedKey;
            const decryptedPrivateKeyBuffer = await decryptData(
                encryptedData,
                encryptionPassword,
                salt,
                iv
            );
            const privateKey = await window.crypto.subtle.importKey(
                "pkcs8",
                decryptedPrivateKeyBuffer,
                {
                    name: "RSA-PSS",
                    hash: { name: "SHA-256" },
                },
                true,
                ["sign"]
            );

            const challengeResponse = await fetch("/api/getChallenge", {
                method: "GET",
            });
            if (!challengeResponse.ok) {
                const text = await challengeResponse.text();
                throw new Error(
                    `Failed to fetch challenge: ${challengeResponse.status} - ${text}`
                );
            }

            const contentType = challengeResponse.headers.get("content-type");
            const responseText = await challengeResponse.text(); // Read response as text
            if (!contentType || !contentType.includes("application/json")) {
                setIsLoggedIn(true);
                navigate("/"); // Navigate to Home on successful login
                return;
            }

            const { challenge } = JSON.parse(responseText); // Now safely parse the JSON
            const encodedChallenge = new TextEncoder().encode(challenge);
            const signature = await window.crypto.subtle.sign(
                {
                    name: "RSA-PSS",
                    saltLength: 32,
                },
                privateKey,
                encodedChallenge
            );

            const verificationResponse = await fetch("/api/verifySignature", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    signature: Array.from(new Uint8Array(signature)),
                    email,
                }),
            });

            if (!verificationResponse.ok) {
                const text = await verificationResponse.text();
                throw new Error(
                    `Failed to verify signature: ${verificationResponse.status} - ${text}`
                );
            }

            const { verified } = await verificationResponse.json();
            if (verified) {
                setIsLoggedIn(true);
                navigate("/home"); // Navigate to Home on successful login
            } else {
                throw new Error("Private key verification failed.");
            }

            setLoading(false);
        } catch (err) {
            setError(err.message);
            console.log("Error during login:", err.message); // Log the error for debugging
            setLoading(false);
        }
    };
    return (
        <>
            <div
                className="min-h-screen flex bg-black text-yellow-500 p-4"
                style={{
                    backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1681469490209-c2f9f8f5c0a2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9uZXklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* <div className="flex-1 flex items-center justify-center p-8">
                    <div className="lg:flex flex-col justify-center max-w-lg bg-gray-800 p-6 rounded-md shadow-lg">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Welcome to MobiCurrency
                        </h1>
                        <p className="text-gray-300 mb-4">
                            <FaDollarSign className="inline-block mr-2 text-yellow-400" />
                            Manage your currency exchanges effortlessly.
                        </p>
                        <p className="text-gray-300 mb-4">
                            <FaExchangeAlt className="inline-block mr-2 text-yellow-400" />
                            Join us and experience seamless transactions.
                        </p>
                        <p className="text-gray-300">
                            <FaRegHandPointRight className="inline-block mr-2 text-yellow-400" />
                            Start your journey with us today!
                        </p>
                    
                    </div>
                </div> */}

                <div className="flex items-center justify-center flex-1 rounded-3xl">
                    <form
                        className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md"
                        onSubmit={isLogin ? handleLogin : handleSignup}
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            {isLogin ? "Login" : "Sign Up"}
                        </h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-yellow-500 text-black p-2 rounded hover:bg-yellow-600 w-full"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
                        </button>
                        <p className="mt-4">
                            {isLogin
                                ? "Don't have an account? "
                                : "Already have an account? "}
                            <button
                                type="button"
                                className="text-yellow-300"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
