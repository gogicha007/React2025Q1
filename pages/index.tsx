import React from 'react';
import Link from 'next/link';
import './App.css';

export default function Home() {
    return <Link href='/details' prefetch={false}>Details</Link>
}
