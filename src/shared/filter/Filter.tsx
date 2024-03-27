import React from 'react';
import './Filter.css';

interface FilterProps {
    open: Boolean,
}

function Filter(props: FilterProps) {
    const {open} = props;

    return (
        <div className={open ? 'filter open' : 'filter'}>
            <span>Filter</span>
        </div>
    )
}

export default Filter;
