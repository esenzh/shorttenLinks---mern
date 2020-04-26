import React from 'react';

export const LinkCard = ({ link }) => {
    return (
        <>
            <h2>Link</h2>
            <p>From: <a href={link.to} target='_blank' rel='noopener noreferrer'>{link.to}</a></p>
            <p>Your link: <a href={link.from} target='_blank' rel='noopener noreferrer'>{link.from}</a></p>
            <p>Click counts on link: <strong>{link.clicks}</strong></p>
            <p>Date of creation: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}