import React, { useContext, useEffect } from 'react'
import './errors.scss';
import { ErrorContext } from '../../context/errorContext';

export function Errors() {
    const { errors } = useContext(ErrorContext);
    console.log(errors);
    return (
        <div>
            {(errors && errors.length > 0) &&
                <ul className="errors">
                    {errors.map(function (error, idx) {
                        return (<li key={idx}>{error.msg}</li>)
                    })}
                </ul>
            }
        </div>
    );
}