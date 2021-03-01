import React, { useContext } from 'react'
import './loader.scss';
import { LoaderContext } from '../../context/loaderContext';

export function Loader() {
    const { loading } = useContext(LoaderContext);
    return (
        <div>
            {loading &&
                <span>Loading...</span>
            }
        </div>
    );
}